"""End-to-end HTTP smoke test. Start the API, then run python backend/smoke_test.py."""
import io, json, math, os, statistics, time, urllib.error, urllib.request, uuid
from pathlib import Path
from docx import Document

BASE=os.getenv("CAREERSAGE_TEST_URL","http://127.0.0.1:8000")
SAMPLE=Path(__file__).resolve().parents[1]/"public"/"sample-resume.pdf"

def request(path, method="GET", body=None, headers=None):
    data=json.dumps(body).encode() if body is not None else None
    h={"Content-Type":"application/json",**(headers or {})}
    try:
        with urllib.request.urlopen(urllib.request.Request(BASE+path,data=data,headers=h,method=method),timeout=5) as r: return r.status,r.read()
    except urllib.error.HTTPError as e: return e.code,e.read()

def obj(path,method="GET",body=None,headers=None):
    status,raw=request(path,method,body,headers)
    if not 200<=status<300: raise AssertionError(f"{method} {path}: HTTP {status}: {raw[:300]!r}")
    return json.loads(raw)

def main():
    assert obj("/api/health")["status"]=="ok"
    with urllib.request.urlopen(BASE+"/",timeout=5) as page: assert b"CareerSage" in page.read()
    email=f"smoke.{uuid.uuid4().hex}@example.test"; phone=f"+1 202 555 {uuid.uuid4().int%10000:04d}"; password="Smoke-Password-2026!"
    session=obj("/api/auth/register","POST",{"username":"Smoke User","email":email,"phone":phone,"password":password})
    token=session["token"]; auth={"Authorization":"Bearer "+token}
    assert request("/api/auth/register","POST",{"username":"Smoke User","email":email,"phone":phone,"password":password})[0]==409
    assert request("/api/auth/login","POST",{"identifier":email,"password":"not-correct"})[0]==401
    assert obj("/api/auth/login","POST",{"identifier":phone,"password":password})["user"]["email"]==email
    def upload(filename,content,content_type):
        boundary="----CareerSage"+uuid.uuid4().hex
        multipart=(f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{filename}\"\r\nContent-Type: {content_type}\r\n\r\n".encode()+content+f"\r\n--{boundary}--\r\n".encode())
        req=urllib.request.Request(BASE+"/api/resumes",data=multipart,headers={**auth,"Content-Type":f"multipart/form-data; boundary={boundary}"},method="POST")
        with urllib.request.urlopen(req,timeout=10) as response: return json.loads(response.read())
    uploaded=upload("Sample_Resume.pdf",SAMPLE.read_bytes(),"application/pdf")
    assert uploaded["status"]=="complete" and uploaded["analysis"]["technicalSkills"]
    latest=obj("/api/resumes/latest/analysis",headers=auth); assert latest["id"]==uploaded["id"]
    dash=obj("/api/dashboard",headers=auth); assert dash["resume"]["fileName"]=="Sample_Resume.pdf"
    qs=obj("/api/interview/questions?company=Amazon",headers=auth); assert len(qs)==1
    topic_rows=obj("/api/interview/questions?topic=Algorithms",headers=auth); assert len(topic_rows)==2
    answer=obj("/api/interview/answers","POST",{"question":qs[0]["question"],"answer":"I took ownership, measured the result, and learned how to improve."},auth)
    prog=obj("/api/progress",headers=auth); assert prog["summary"]["answers"]==1 and prog["recentActivity"]
    assert request("/api/resumes","POST",None,auth)[0]==422
    samples=[]
    for _ in range(30):
        start=time.perf_counter(); assert request("/api/health")[0]==200; samples.append((time.perf_counter()-start)*1000)
    ordered=sorted(samples); p95=ordered[math.ceil(.95*len(ordered))-1]
    doc=Document();doc.add_paragraph("Python software engineer with React, SQL, REST API, Git, Docker and AWS experience delivering web applications and measured project results.");buffer=io.BytesIO();doc.save(buffer);docx_result=upload("Smoke_Resume.docx",buffer.getvalue(),"application/vnd.openxmlformats-officedocument.wordprocessingml.document");assert "python" in docx_result["analysis"]["technicalSkills"]
    bad_boundary="----CareerSage"+uuid.uuid4().hex; bad_content=b"invalid"; bad_body=(f"--{bad_boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"bad.txt\"\r\nContent-Type: text/plain\r\n\r\n".encode()+bad_content+f"\r\n--{bad_boundary}--\r\n".encode());bad_req=urllib.request.Request(BASE+"/api/resumes",data=bad_body,headers={**auth,"Content-Type":f"multipart/form-data; boundary={bad_boundary}"},method="POST")
    try: urllib.request.urlopen(bad_req,timeout=5); raise AssertionError("unsupported file unexpectedly accepted")
    except urllib.error.HTTPError as error: assert error.code==415
    obj("/api/auth/logout","POST",headers=auth); assert request("/api/auth/me",headers=auth)[0]==401
    print(json.dumps({"health":"pass","register_login_duplicate_wrong_password_logout":"pass","resume_pdf_and_docx_extraction":"pass","saved_analysis_dashboard":"pass","company_and_topic_filters":"pass","answer_and_progress":"pass","invalid_and_unsupported_upload":"pass","top_role":uploaded["analysis"]["roleAlignmentList"][0]["role"],"answer_score":answer["score"],"health_requests":len(samples),"health_median_ms":round(statistics.median(samples),2),"health_p95_ms":round(p95,2)},indent=2))

if __name__=="__main__": main()

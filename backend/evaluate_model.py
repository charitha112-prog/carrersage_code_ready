"""Repeatable, small labeled smoke evaluation for the transparent role matcher."""
from main import analyze_text

CASES = [
    ("Python Java SQL backend REST API Docker Git", "Backend Developer"),
    ("React JavaScript TypeScript HTML CSS frontend Git", "Frontend Developer"),
    ("Python pandas SQL Excel data analysis communication", "Data Analyst"),
    ("Python machine learning pandas tensorflow AWS SQL", "ML Engineer"),
    ("Java Python React SQL Git testing REST API", "Software Engineer"),
]

def evaluate():
    correct=0; reciprocal_rank=0; detail=[]
    for text,label in CASES:
        ranked=analyze_text(text)["roleAlignmentList"]
        rank=next((i+1 for i,x in enumerate(ranked) if x["role"]==label),len(ranked)+1)
        correct += rank==1
        reciprocal_rank += 1/rank
        detail.append({"expected":label,"top_prediction":ranked[0]["role"],"rank":rank})
    result={"examples":len(CASES),"top1_accuracy":correct/len(CASES),"mean_reciprocal_rank":reciprocal_rank/len(CASES),"cases":detail,"scope":"Five hand-written synthetic keyword profiles; smoke check only, not a representative benchmark."}
    print(result)
    return result

if __name__=="__main__": evaluate()

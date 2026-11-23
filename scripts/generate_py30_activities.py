import json
from pathlib import Path

root=Path('/home/ubuntu/skillsphere')
d=json.loads((root/'references/py30-source-content.json').read_text())
items=[]
for day in d['days']:
    title=f"Day {day['day']:02d} · {day['title']}"
    if day['kind']=='lesson':
        brief=day.get('task') or day.get('goal') or 'Complete the daily Python exercise.'
        steps=[f"Read and type the {len(day.get('concepts',[]))} concept examples for this day.", "Run the examples and change at least one value or line to observe what changes.", brief, "Run the starter code, fix or replace each TODO, and save your working version."]
        success=["The starter program runs successfully.", "You can explain one change you made and its output.", "The daily task is complete and tested with a second input or variation."]
        starter=day['lab']['starter']; hint=day['lab'].get('hint','Use the concept sheets above as your reference.')
        checks=day.get('checks',[])
    else:
        brief=day['brief']; steps=["Read the weekly build brief and requirements.", *day['requirements'], "Run the starter repeatedly, test invalid input, and polish the final output."]
        success=["The build meets every listed requirement.", "The program handles the required edge case without crashing.", "You can explain what you would improve in the stretch goals."]
        starter=day['starter']; hint='Work through the requirements one at a time and test after each change.'
        checks=[]
    quiz=None
    if checks:
        q=checks[0]
        quiz={'question':q['question'] + (('\n\n'+q.get('code','')) if q.get('code') else ''), 'options':q['options'], 'answer':q['answer'], 'explanation':q.get('explain','')}
    items.append({'id':f'py30-d{day["day"]:02d}','title':title,'sourceUrl':f'https://py30-nete5pnd.manus.space/day/{day["day"]}','starterCode':starter,'hints':[hint],'activity':{'title':f'{"Daily exercise" if day["kind"]=="lesson" else "Weekly build"}: {day["title"]}','brief':brief,'steps':steps,'successCriteria':success},'reflectionPrompt':day.get('reflection'),'quiz':quiz})

out='''import type { PythonForgeActivity } from "@/lib/pythonForgeActivities";\n\nexport const PY30_COURSE_SLUG = "30-days-to-learn-python";\n\nexport const py30Activities: PythonForgeActivity[] = '''+json.dumps(items,indent=2,ensure_ascii=False)+''' as PythonForgeActivity[];\n\nconst byTitle = new Map(py30Activities.map(activity => [activity.title, activity]));\n\nexport function getPy30ActivityForModule(courseSlug?: string | null, moduleTitle?: string | null) {\n  if (courseSlug !== PY30_COURSE_SLUG || !moduleTitle) return null;\n  return byTitle.get(moduleTitle) ?? null;\n}\n'''
(root/'client/src/lib/py30Activities.ts').write_text(out)
print('generated',len(items),'activities')

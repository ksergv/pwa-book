import re
import json
from pathlib import Path

INPUT="alchemy.htm"
BOOK="alchemy"

root=Path("books")/BOOK
pages_dir=root/"pages"
img_dir=root/"img"

pages_dir.mkdir(parents=True,exist_ok=True)

html=Path(INPUT).read_text(encoding="utf8")

# убрать верхнюю часть html
body=re.search(r"<body.*?>(.*)</body>",html,re.S).group(1)

# разделить по главам
sections=re.split(r'(?=<h2 id="section)',body)

pages=[]

for i,sec in enumerate(sections,1):

    name=f"{i:03}.html"

    # исправить пути картинок
    sec=sec.replace("./alchemy_files/","img/")

    page_html=f"""
<div class="page">
{sec}
</div>
"""

    (pages_dir/name).write_text(page_html,encoding="utf8")

    pages.append({
        "id":i,
        "file":f"pages/{name}"
    })

json.dump({"pages":pages},
          open(root/"book.json","w"),
          indent=2)

print("pages created:",len(pages))
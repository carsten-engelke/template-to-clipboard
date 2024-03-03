#!/usr/bin/env python3
# File name: csvDB-to-json.py
# Description: 
# Author: Carsten Engelke 
# Date: 03-03-2024

import sys, json

srcfile = ""
if len(sys.argv) > 1:
    srcfile = sys.argv[1]
else:
    srcfile = "template-db.csv"

db = list()
#use endoding of excel output!
with open(srcfile, encoding="utf-8-sig") as src:
    for line in src:
        if line != "":
            obj = dict();
            line = line.strip("\n")
            obj["img"] = None
            obj["title"] = line.split(";")[0]
            obj["tags"] = line.split(";")[1]
            obj["text"] = line.split(";")[2]
            db.append(obj)
print(db)
with open("template-db.json", mode="w") as dest:
    json.dump(db, dest)

input("Hit Enter to exit")

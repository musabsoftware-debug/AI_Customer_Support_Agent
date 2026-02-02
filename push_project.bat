@echo off
git push --force origin main > push_output.txt 2>&1
type push_output.txt
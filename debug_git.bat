@echo off
cd /d D:\AI_customer_support_Agent
echo Current Directory: %CD% > debug_output.txt
git remote -v >> debug_output.txt 2>&1
git status >> debug_output.txt 2>&1
git push origin main >> debug_output.txt 2>&1
echo Done >> debug_output.txt
import os
import re
def list_js_files():
    files = [f for f in os.listdir() if f.endswith('.js') or  f.endswith('.html')]
    return files
def choose_file(files):
    if len(files) == 1:
        return files[0]
    for i, file in enumerate(files):
        print(f"{i}: {file}")
    index = int(input("Enter the index of the file you want to process: "))
    return files[index]
def remove_js_comments(file_path):
    with open(file_path, 'r',encoding='utf8') as file:
        content = file.read()
    content = re.sub(r'//.*', '', content)
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    with open(file_path, 'w',encoding='utf8') as file:
        file.write(content)
def main():
    files = list_js_files()
    if not files:
        print("No JavaScript files found in the current directory.")
        return
    file_to_process = choose_file(files)
    print(f"Processing file: {file_to_process}")
    remove_js_comments(file_to_process)
    print("Comments removed successfully.")
if __name__ == "__main__":
    main()
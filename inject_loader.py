import os
import glob

# Paths
root_dir = r"d:\GitHub Projects\Portfolio"
loader_html_path = os.path.join(root_dir, "Loader", "loader.html")

# Read loader block
with open(loader_html_path, 'r', encoding='utf-8') as f:
    loader_html_content = f.read()

html_files = glob.glob(os.path.join(root_dir, "**", "*.html"), recursive=True)

for filepath in html_files:
    # Skip the index.html at root (it's already set up uniquely) and the loader.html template itself
    rel_path = os.path.relpath(filepath, root_dir)
    if rel_path == "index.html" or "Loader" in rel_path:
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine depth string to link back to /Loader/ correctly
    depth = rel_path.count(os.sep)
    path_prefix = "../" * depth if depth > 0 else "./"
    
    loader_css_link = f'\n  <!-- Aegis Loader Styles -->\n  <link rel="stylesheet" href="{path_prefix}Loader/loader.css">\n'
    loader_js_link = f'\n  <!-- Aegis Loader Script -->\n  <script src="{path_prefix}Loader/loader.js"></script>\n</body>'

    # 1. Inject CSS into head if not already there
    if "Loader/loader.css" not in content:
        content = content.replace("</head>", f"{loader_css_link}</head>")
        
    # 2. Add preload class to HTML tag if not there
    if '<html lang="en">' in content:
        content = content.replace('<html lang="en">', '<html lang="en" class="preload">')
    
    # 3. Add preload class to body tag if not there
    if '<body' in content and 'class=' not in content.split('<body')[1].split('>')[0]:
        content = content.replace('<body', '<body class="preload"')
    elif '<body class="' in content and 'preload' not in content:
        content = content.replace('<body class="', '<body class="preload ')

    # 4. Inject loader HTML right after <body> if not already there
    if "aegis-bg-grid" not in content:
        # Find the end of the body tag (e.g., <body class="preload">)
        body_start_idx = content.find("<body")
        if body_start_idx != -1:
            body_end_idx = content.find(">", body_start_idx) + 1
            content = content[:body_end_idx] + "\n" + loader_html_content + content[body_end_idx:]

    # 5. Inject JS right before </body> if not already there
    if "Loader/loader.js" not in content:
        content = content.replace("</body>", loader_js_link)

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print(f"Injection complete for {len(html_files)} files.")

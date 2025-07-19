import psutil

def detect():
    suspicious_keywords = ['keylogger', 'logger', 'keyboard', 'capture']
    flagged = []
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            name = proc.info['name'] or ''
            cmdline = ' '.join(proc.info['cmdline']) if proc.info['cmdline'] else ''
            for keyword in suspicious_keywords:
                if keyword in name.lower() or keyword in cmdline.lower():
                    flagged.append({
                        'pid': proc.info['pid'],
                        'name': name,
                        'cmdline': cmdline
                    })
                    break
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue
    return {
        'suspicious_found': bool(flagged),
        'flagged_processes': flagged
    } 
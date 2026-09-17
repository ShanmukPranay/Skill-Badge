import pg8000
from urllib.parse import urlparse

url = 'postgresql://postgres.kvpcsltdmsmcytytlszl:SkillBridge2024@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
p = urlparse(url)
print('Host:', p.hostname)
print('User:', p.username)
print('Pass:', p.password, f'(len={len(p.password)})')
print('DB:  ', p.path.lstrip('/'))
print('Connecting...')

try:
    conn = pg8000.connect(
        user=p.username,
        password=p.password,
        host=p.hostname,
        port=p.port,
        database=p.path.lstrip('/')
    )
    print('SUCCESS - connection works!')
    conn.close()
except Exception as e:
    print('FAILED:', e)

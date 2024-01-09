import os, requests, time, json

#https://dev-nakama.winterpixel.io/v2/rpc/collect_timed_bonus

username = os.environ['username']
password = os.environ['password']


def auto_claim():
    while True:
        response = requests.post(
            "https://dev-nakama.winterpixel.io/v2/account/authenticate/email?create=false",
            data=json.dumps({
                "email": username,
                "password": password,
                "vars": {
                    "client_version": "99999"
                }
            }),
            headers={
                "authorization":
                "Basic OTAyaXViZGFmOWgyZTlocXBldzBmYjlhZWIzOTo="
            })

        token = json.loads(response.content)['token']
        payload = '"{}"'

        response = requests.post(
            "https://dev-nakama.winterpixel.io/v2/rpc/collect_timed_bonus",
            headers={"authorization": f"Bearer {token}"},
            data=payload.encode('utf-8'))

        print(json.loads(response.content))

        time.sleep(1801)


auto_claim()

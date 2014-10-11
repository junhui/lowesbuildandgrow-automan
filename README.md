This is used for Lowe's build and grow clinics enrollment.


Change settings at file `setting.json` with your related information:
```
{
    "loginName": "jason.xxxxx@blabla.com",
    "password": "h3zdwp",
    "zipcode": "12205",
    "frequency": 2
}
```
- loginName: your account on the site
- password: your password on the site
- zipcode: the nearest zipcode
- frequency: auto check deamon run interval minutes

run `node app`

it will automaticlly run a deamon to check and enroll the first avaiable seat.

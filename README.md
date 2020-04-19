# Smarthome - Backend  

## Objective  

Build a backend engine for home or office automation system to remotely control devices at home / office.

## Stack  

 **Platform:** Node.JS  
 **Language:** Typescript  
 **Package Manager:** npm  
 **Database:** JSON file  
 **Frameworks & Libraries:**  
 - **express** - For API Engine  
 - **body-parser** - For request body parsing  
 - **cors** - For Cross-Origin-Resource-Sharing support  
 - **fs-extra** - For smoother file (for JSON based database) operation  
 - **@hapi/joi** -  For schema validation  
 
**Supported OS:** Linux, Windows, Mac  
**Server Port:** 8080  

## Setup  

Setup of this project is simple.   

 1. Clone the repository  
 2. To install the all dependencies, run `npm install`   
 3. To start the server, run `npm start`  
**Note:** The above command takes care of building the project also. If you want to just build the application, run `npm run build`  

## API Specs  

### Discover devices on the network  
**Endpoint:**  `GET /api/v1/devices/discover`  
**Sample Response:**  
```
[
	{
        uuid:  "3a96dede-481e-4a54-992d-6f6580185902",
	    ip:  "192.168.1.35",
        type:  "TV",
        servicePort:  80
        isAdded:  true,
    }
]
```
---

### Get all devices from database  
**Endpoint:**  `GET /api/v1/devices`  
**Sample Response:**  
```
[
	{
		name:  "Bedroom TV",
		deviceMeta:  {
			uuid:  "3a96dede-481e-4a54-992d-6f6580185902",
			ip:  "192.168.1.35",
			type:  "TV",
			servicePort:  80
		}
	}
]
```
---

### Get device from database by UUID  
**Endpoint:**  `GET /api/v1/devices/:uuid`  
**URI Params:**  

 - **uuid** _(required)_ - UUID of the device.  

**Sample Response:**  
```
{
	name: "Bedroom TV",
	deviceMeta: {
		uuid:  "3a96dede-481e-4a54-992d-6f6580185902",
		ip:  "192.168.1.35",
		type:  "TV",
		servicePort:  80
	}
}
```
---

### Add device to database  
**Endpoint:**  `POST /api/v1/devices`  
 
**Headers:**  
- **Content-Type** - _application/json_ _**(required)**_  

**Body:**  
- **name** - Name of the device. _**(required)**_ _(**Type**: string, **Length**: 3 to 30, **Allowed Characters**: letters, numbers, spaces and apostrophe ( ' ))_  
- **uuid** - UUID of the device. _**(required)**_ _(**Type**: string, **Format**: GUID / UUID)_  
- **ip** - IP of the device. _**(required)**_ _(**Type**: string, **Format**: GUID / UUID)_
- **port** - Port of the device. _**(required)**_  _(**Type**: string, **Type**: number, **Range**: 1 - 65535)_  
- **type** - Port of the device. _**(required)**_  _(**Type**: string, **Allowed**: AC, TV, Light )_  

**Sample Body:**  
```
{
    "name": "Living Room TV",
    "type": "Light",
    "ip": "192.168.1.36",
    "servicePort": 3001,
    "uuid": "f82190bd-8c5f-48d2-bcf2-893b1f05f22d"
}
```

**Sample Response:**  
```
{
    "message": "Device added successfully",
    "device": {
        "name": "Living Room TV",
        "deviceMeta": {
            "uuid": "f82190bd-8c5f-48d2-bcf2-893b1f05f22d",
            "ip": "192.168.1.36",
            "type": "Light",
            "servicePort": 3001
        }
    }
}
```
---

### Update device to database  
**Endpoint:**  `PUT /api/v1/devices/:uuid`  
**URI Params:**  
 - **uuid** - UUID of the device. _**(required)**_  
 
**Headers:**
- **Content-Type** - _application/json_ _**(required)**_  

**Body:**  
- **name** - Name of the device. _**(required)**_ _(**Type**: string, **Length**: 3 to 30, **Allowed Characters**: letters, numbers, spaces and apostrophe ( ' ))_  

**Sample Body:**  
```
{
    "name": "Living Room TV"
}
```

**Sample Response:**  
```
{
    "message": "Device updated successfully",
    "device": {
        "name": "Living Room TV",
        "deviceMeta": {
            "uuid": "f82190bd-8c5f-48d2-bcf2-893b1f05f22d",
            "ip": "192.168.1.36",
            "type": "Light",
            "servicePort": 3001
        }
    }
}
```
---

### Delete device from database by UUID  
**Endpoint:**  `DELETE /api/v1/devices/:uuid`  
**URI Params:**  

 - **uuid** _(required)_ - UUID of the device.  

**Sample Response:**  
```
{
    "message": "Device removed successfully",
    "device": {
        "name": "Living Room TV",
        "deviceMeta": {
            "uuid": "f82190bd-8c5f-48d2-bcf2-893b1f05f22d",
            "ip": "192.168.1.36",
            "type": "Light",
            "servicePort": 3001
        }
    }
}
```
---


### Perform action on device  
**Endpoint:**  `POST /api/v1/actions/perform/:uuid`  
**URI Params:**  

 - **uuid** _(required)_ - UUID of the device.  

**Headers:**  
- **Content-Type** - _application/json_ _**(required)**_  

**Body:**  
 - **action** - Action to be performed. _**(required)**_ _(**Type**: string, **NOTE**: Refer to the device chart below)_  
 - **args** - Arguments required for the action. _**(optional)**_ _(**Type**: any, **NOTE**: Refer to the device chart below)_  

**Sample Body:**  

```
{
	"action":"keyPress",
	"args":"Mute"
}
```

**Sample Response:**  
```
true
```
---



### Get status of device  
**Endpoint:**  `GET /api/v1/actions/get-status/:uuid/`  
**URI Params:**  

 - **uuid** _(required)_ - UUID of the device.  

**Sample Response:**  
> **NOTE**: Refer to the device chart below  
---

## Device Chart  

### TV  
**Actions and Arguments**  

 - To Set Volume  
	 - **action** : _setVolume_  
	 - **agrs** : number _(**Range** : 0 - 100)_  
   
 - To Toggle Mute
	 - **action** : _toggleMute_  
	 
 - To Set Power State  
	 - **action** : _setPowerState_  
	 - **agrs** : string _(**Values** : _ON_, _OFF_)_  
   
 - To Key Press  
	 - **action** : _keyPress_  
	 - **agrs** : string _(**Values** : _Num1_, _Num2_, _Num3_, _Num4_, _Num5_, _Num6_, _Num7_, _Num8_, _Num9_, _Num0_, _VolumeUp_, _VolumeDown_, _Mute_, _Right_, _Left_, _Up_, _Down_, _ChannelUp_, _ChannelDown_, _Confirm_, _Return_, _Red_, _Green_, _Yellow_, _Blue_, _GGuide_, _Home_, _Rec_, _Tv_, _Rewind_, _Pause_, _Forward_, _TvPower_,)_  

**Status Object**  

```
{
	"powerState": "ON",
	"volume": 35,
	"isMuted": false
}
```
---

### Light  
**Actions and Arguments**  

 - To Set Brightness  
	 - **action** : _setBrightness_  
	 - **agrs** : number _(**Range** : 0 - 100)_  
	 
 - To Set Color  
	 - **action** : _setColor_  
	 - **agrs** : string _(**Format** : Hex color string with leading #)_  
	 
 - To Set Power State  
	 - **action** : _setPowerState_  
	 - **agrs** : string _(**Values** : _ON_, _OFF_)_  

**Status Object**  

```
{
	"powerState": "ON",
	"brightness": 35,
	"color": "#FFFFFF"
}
```
---

### AC  
**Actions and Arguments**  

 - To Set Temperature  
	 - **action** : _setTemperature_  
	 - **agrs** : number _(**Range** : 0 - 100)_  
	 
 - To Set Mode  
	 - **action** : _setMode_  
	 - **agrs** : string _(**Values** : _COOL_, _FAN_, _HEAT_, _DRY_, _AUTO_)_  
	 
 - To Set Fan Speed  
	 - **action** : _setFanSpeed_  
	 - **agrs** : string _(**Values** : _HIGH_, _MEDIUM_, _LOW_, _AUTO_)_  
	 
 - To Set Swing  
	 - **action** : _setSwing_  
	 - **agrs** : string _(**Values** : _S30_, _S45_, _S60_,  _AUTO_, _OFF_)_  
	 
 - To Set Power State  
	 - **action** : _setPowerState_  
	 - **agrs** : string _(**Values** : _ON_, _OFF_)_  

**Status Object**  

```
{
	"powerState": "ON",
	"temp": 35,
	"mode": "COOL",
	"fanSpeed": "HIGH",
	"swing": "S30"
}
```
---

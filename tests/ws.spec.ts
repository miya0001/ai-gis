// これは手動の確認用


import { WebSocket } from 'ws';

const json = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [132.561761, 34.245583]
      },
      "properties": {
        "title": "医療法人 社団永楽会 前田病院",
        "address": "呉市中央2丁目6番20号",
        "description": "内科,呼吸器内科,循環器内科,消化器内科,血液内科,歯科,リハビリテーション科,放射線診断科"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [132.504593, 34.377318]
      },
      "properties": {
        "title": "マツダ株式会社マツダ病院",
        "address": "安芸郡府中町青崎南2番15号",
        "description": "循環器内科,消化器内科,呼吸器内科,糖尿病内科,精神科,心療内科,小児科,外科,脳神経外科,整形外科,皮膚科,泌尿器科,眼科,耳鼻いんこう科,歯科口腔外科,麻酔科,リハビリテーション科,放射線科,救急科"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [132.530952, 34.368431]
      },
      "properties": {
        "title": "山本整形外科病院",
        "address": "安芸郡海田町堀川町2-23",
        "description": "整形外科,内科,眼科,リウマチ科,リハビリテーション科,麻酔科"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [132.678948, 34.182926]
      },
      "properties": {
        "title": "一般財団法人広島結核予防協会 住吉浜病院",
        "address": "呉市下蒲刈町下島2498",
        "description": "内科,放射線科,呼吸器科"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [133.089598, 34.402743]
      },
      "properties": {
        "title": "総合病院三原赤十字病院",
        "address": "三原市東町二丁目7番1号",
        "description": "内科,呼吸器内科,循環器内科,消化器内科,内科系その他,外科,整形外科,脳神経外科,小児科,皮膚科,泌尿器科,産婦人科,眼科,耳鼻いんこう科,リウマチ科,リハビリテーション科,放射線科,麻酔科,外科(がん),小児外科,歯科口腔外科"
      }
    }
  ]
}

const ws = new WebSocket('wss://api-ws.geolonia.com/dev', {
  headers: {
    Origin: 'https://geolonia.github.io'
  }
});

ws.on('open', () => {
  ws.send(JSON.stringify({
    action: "broadcast",
    channel: "signage",
    message: {
      geojson: json
    }
  }));
});

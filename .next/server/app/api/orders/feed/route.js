(()=>{var e={};e.id=170,e.ids=[170],e.modules={2849:e=>{function r(e){var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}r.keys=()=>[],r.resolve=r,r.id=2849,e.exports=r},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},2361:e=>{"use strict";e.exports=require("events")},1808:e=>{"use strict";e.exports=require("net")},7282:e=>{"use strict";e.exports=require("process")},2781:e=>{"use strict";e.exports=require("stream")},1576:e=>{"use strict";e.exports=require("string_decoder")},9512:e=>{"use strict";e.exports=require("timers")},4404:e=>{"use strict";e.exports=require("tls")},7310:e=>{"use strict";e.exports=require("url")},3837:e=>{"use strict";e.exports=require("util")},9796:e=>{"use strict";e.exports=require("zlib")},4936:(e,r,t)=>{"use strict";t.r(r),t.d(r,{originalPathname:()=>E,patchFetch:()=>m,requestAsyncStorage:()=>p,routeModule:()=>d,serverHooks:()=>l,staticGenerationAsyncStorage:()=>c});var s={};t.r(s),t.d(s,{GET:()=>n});var o=t(9303),i=t(8716),a=t(670),u=t(9487);async function n(e){try{let{searchParams:r}=new URL(e.url),t=r.get("status")||"pending,preparing,ready",s=parseInt(r.get("limit")||"50"),o=t.split(","),i=o.map(()=>"?").join(","),a=`SELECT 
        o.id,
        o.order_number,
        o.order_type,
        o.status,
        o.total,
        o.created_at,
        o.updated_at,
        o.delivery_address,
        COUNT(oi.id) as item_count,
        GROUP_CONCAT(p.name SEPARATOR ', ') as item_names
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.status IN (${i})
      GROUP BY o.id
      ORDER BY 
        CASE 
          WHEN o.status = 'ready' THEN 0
          WHEN o.status = 'preparing' THEN 1
          WHEN o.status = 'pending' THEN 2
          ELSE 3
        END,
        o.created_at ASC
      LIMIT ?`,n=[...o,s],d=await u.db.query(a,n);return Response.json({success:!0,data:d,count:Array.isArray(d)?d.length:0})}catch(e){return console.error("[v0] GET /api/orders/feed error:",e),Response.json({success:!1,error:"Failed to fetch order feed",details:e instanceof Error?e.message:String(e)},{status:500})}}let d=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/orders/feed/route",pathname:"/api/orders/feed",filename:"route",bundlePath:"app/api/orders/feed/route"},resolvedPagePath:"D:\\ERP\\app\\api\\orders\\feed\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:p,staticGenerationAsyncStorage:c,serverHooks:l}=d,E="/api/orders/feed/route";function m(){return(0,a.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:c})}},9487:(e,r,t)=>{"use strict";t.d(r,{db:()=>o});let s=t(3785).createPool({host:process.env.DB_HOST||"localhost",user:process.env.DB_USER||"root",password:process.env.DB_PASSWORD||"",database:process.env.DB_NAME||"fried_chicken_4s",port:Number(process.env.DB_PORT)||3306,waitForConnections:!0,connectionLimit:10,queueLimit:0}),o={query:async(e,r)=>{try{let t=await s.getConnection();try{let[s]=await t.execute(e,r||[]);return s}finally{t.release()}}catch(e){throw console.error("[DB] Database query error:",e),e}}}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[948,898],()=>t(4936));module.exports=s})();
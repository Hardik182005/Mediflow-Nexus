module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},61313,e=>{"use strict";var t=e.i(63086),r=e.i(82260),n=e.i(7491),a=e.i(54285),i=e.i(15763),s=e.i(76039),o=e.i(6528),l=e.i(19040),u=e.i(9368),d=e.i(68612),c=e.i(9125),p=e.i(79238),g=e.i(89038),m=e.i(8927),h=e.i(86643),v=e.i(93695);e.i(17149);var R=e.i(38912),x=e.i(80312),y=e.i(97827);let f=`You are an AI Healthcare Revenue Cycle Assistant specializing in Insurance Verification (VOB), Prior Authorization, and Revenue Risk Analysis.

You receive one or more unstructured healthcare inputs and produce a structured, accurate, clinic-ready insurance intelligence report.

INPUT TYPES you may receive:
1) Insurance Card (image OCR text)
2) Eligibility / Benefits PDF text
3) Manual Form Inputs
4) Clinical context (Diagnosis, CPT codes, notes)

You MUST return ONLY a valid JSON object (no markdown, no code fences, no explanation) with exactly these keys:

{
  "insuranceSummary": {
    "patientName": "string or Unknown",
    "dob": "string or Unknown",
    "payerName": "string",
    "memberId": "string or Unknown",
    "groupNumber": "string or Unknown",
    "planType": "PPO | HMO | EPO | Medicare | Medicaid | Unknown",
    "coverageStatus": "Active | Inactive | Unknown"
  },
  "dataConfidence": {
    "score": number (0-100),
    "missingFields": ["string"],
    "conflicts": ["string"],
    "assumptions": ["string"]
  },
  "coverageBenefits": {
    "coverageStatus": "Active | Inactive | Unknown",
    "serviceEligibility": "Covered | Possibly Covered | Not Determined | Not Covered",
    "deductibleTotal": "string (e.g. $3,000)",
    "deductibleRemaining": "string",
    "copay": "string",
    "coinsurance": "string (e.g. 20%)",
    "outOfPocketMax": "string",
    "outOfPocketMet": "string",
    "patientResponsibilityEstimate": "string",
    "expectedReimbursement": "string",
    "notes": ["string"]
  },
  "priorAuth": {
    "required": "Required | Possibly Required | Not Required | Unknown",
    "requiredDocuments": ["string"],
    "missingDocuments": ["string"],
    "submissionReadiness": "Ready | Missing Docs | Not Ready",
    "notes": "string"
  },
  "denialRisk": {
    "level": "Low | Medium | High",
    "reasons": ["string"],
    "mitigationSteps": ["string"]
  },
  "revenueIntelligence": {
    "expectedReimbursementRange": "string (e.g. $800–$1,200)",
    "patientResponsibilityRange": "string",
    "revenueAtRisk": "Low | Medium | High",
    "delayRisk": "Low | Medium | High",
    "revenueNotes": ["string"]
  },
  "operationalRecommendation": {
    "action": "Proceed with scheduling | Hold until prior auth | Require additional verification | Collect upfront payment estimate",
    "reasoning": "string",
    "urgentActions": ["string"]
  },
  "patientSummary": {
    "estimatedCost": "string",
    "whatInsuranceCovers": "string",
    "nextSteps": ["string"]
  }
}

RULES:
- Do NOT claim real-time payer access
- Use correct healthcare terminology
- Be explicit about assumptions
- If data is missing, make reasonable expert assumptions and flag them in dataConfidence
- Return ONLY the JSON object, nothing else`;async function w(e){try{let t,{inputs:r}=await e.json();if(!r||0===r.length)return y.NextResponse.json({error:"No inputs provided"},{status:400});let n=process.env.GEMINI_API_KEY;if(!n||"your_gemini_api_key_here"===n)return y.NextResponse.json({error:"GEMINI_API_KEY not configured. Please add your key to .env.local and restart the dev server."},{status:500});let a=new x.GoogleGenerativeAI(n).getGenerativeModel({model:"gemini-2.5-flash",systemInstruction:f}),i=r.map(e=>`--- ${e.type.toUpperCase()} ---
${e.content.trim()}`).join("\n\n"),s=`Analyze the following insurance inputs and generate a clinic-ready VOB intelligence report as JSON:

${i}`,o=(await a.generateContent(s)).response.text().trim(),l=o.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/\s*```$/i,"").trim();try{t=JSON.parse(l)}catch{return y.NextResponse.json({raw:o},{status:200})}return y.NextResponse.json({report:t},{status:200})}catch(t){console.error("[VOB Analyze Error]",t);let e=t instanceof Error?t.message:"Internal server error";return y.NextResponse.json({error:e},{status:500})}}e.s(["POST",0,w],44340);var E=e.i(44340);let b=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/vob/analyze/route",pathname:"/api/vob/analyze",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/OneDrive/Desktop/Mediflow Nexus/Mediflow-Nexus/frontend/app/api/vob/analyze/route.ts",nextConfigOutput:"",userland:E,...{}}),{workAsyncStorage:C,workUnitAsyncStorage:N,serverHooks:A}=b;async function k(e,t,n){n.requestMeta&&(0,a.setRequestMeta)(e,n.requestMeta),b.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let x="/api/vob/analyze/route";x=x.replace(/\/index$/,"")||"/";let y=await b.prepare(e,t,{srcPage:x,multiZoneDraftMode:!1});if(!y)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:f,params:w,nextConfig:E,parsedUrl:C,isDraftMode:N,prerenderManifest:A,routerServerContext:k,isOnDemandRevalidate:P,revalidateOnlyGenerated:O,resolvedPathname:I,clientReferenceManifest:S,serverActionsManifest:T}=y,M=(0,o.normalizeAppPath)(x),q=!!(A.dynamicRoutes[M]||A.routes[I]),_=async()=>((null==k?void 0:k.render404)?await k.render404(e,t,C,!1):t.end("This page could not be found"),null);if(q&&!N){let e=!!A.routes[I],t=A.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(E.adapterPath)return await _();throw new v.NoFallbackError}}let U=null;!q||b.isDev||N||(U="/index"===(U=I)?"/":U);let j=!0===b.isDev||!q,H=q&&!j;T&&S&&(0,s.setManifestsSingleton)({page:x,clientReferenceManifest:S,serverActionsManifest:T});let D=e.method||"GET",$=(0,i.getTracer)(),B=$.getActiveScopeSpan(),F=!!(null==k?void 0:k.isWrappedByNextServer),L=!!(0,a.getRequestMeta)(e,"minimalMode"),K=(0,a.getRequestMeta)(e,"incrementalCache")||await b.getIncrementalCache(e,E,A,L);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let z={params:w,previewProps:A.preview,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts},cacheComponents:!!E.cacheComponents,supportsDynamicResponse:j,incrementalCache:K,cacheLifeProfiles:E.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n,a)=>b.onRequestError(e,t,n,a,k)},sharedContext:{buildId:f}},G=new l.NodeNextRequest(e),Y=new l.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(G,(0,u.signalFromNodeResponse)(t));try{let a,s=async e=>b.handle(V,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=$.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${D} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),a&&a!==e&&(a.setAttribute("http.route",n),a.updateName(t))}else e.updateName(`${D} ${x}`)}),o=async a=>{var i,o;let l=async({previousCacheEntry:r})=>{try{if(!L&&P&&O&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await s(a);e.fetchMetrics=z.renderOpts.fetchMetrics;let o=z.renderOpts.pendingWaitUntil;o&&n.waitUntil&&(n.waitUntil(o),o=void 0);let l=z.renderOpts.collectedTags;if(!q)return await (0,p.sendResponse)(G,Y,i,z.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[h.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await b.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:P})},!1,k),t}},u=await b.handleResponse({req:e,nextConfig:E,cacheKey:U,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:P,revalidateOnlyGenerated:O,responseGenerator:l,waitUntil:n.waitUntil,isMinimalMode:L});if(!q)return null;if((null==u||null==(i=u.value)?void 0:i.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(o=u.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});L||t.setHeader("x-nextjs-cache",P?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,g.fromNodeOutgoingHttpHeaders)(u.value.headers);return L&&q||d.delete(h.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,m.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(G,Y,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};F&&B?await o(B):(a=$.getActiveScopeSpan(),await $.withPropagatedContext(e.headers,()=>$.trace(d.BaseServerSpan.handleRequest,{spanName:`${D} ${x}`,kind:i.SpanKind.SERVER,attributes:{"http.method":D,"http.target":e.url}},o),void 0,!F))}catch(t){if(t instanceof v.NoFallbackError||await b.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:P})},!1,k),q)throw t;return await (0,p.sendResponse)(G,Y,new Response(null,{status:500})),null}}e.s(["handler",0,k,"patchFetch",0,function(){return(0,n.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:N})},"routeModule",0,b,"serverHooks",0,A,"workAsyncStorage",0,C,"workUnitAsyncStorage",0,N],61313)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0un9g12._.js.map
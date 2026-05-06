module.exports=[42241,e=>{"use strict";var t=e.i(63086),r=e.i(82260),a=e.i(7491),n=e.i(54285),i=e.i(15763),s=e.i(76039),o=e.i(6528),l=e.i(19040),c=e.i(9368),u=e.i(68612),p=e.i(9125),d=e.i(79238),g=e.i(89038),m=e.i(8927),h=e.i(86643),y=e.i(93695);e.i(17149);var f=e.i(38912),v=e.i(80312),R=e.i(97827),w=e.i(40480),E=e.i(22734),T=e.i(14747);let x={pdf:"application/pdf",txt:"text/plain",md:"text/plain",csv:"text/csv",html:"text/html",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",mp4:"video/mp4",mov:"video/quicktime",avi:"video/avi",webm:"video/webm",mp3:"audio/mp3",wav:"audio/wav",ogg:"audio/ogg"},N=`You are an expert Healthcare Go-To-Market (GTM) Strategist AI.

Your task is to analyze multi-modal startup inputs (PDFs, presentations, videos, images, documents) and generate a complete GTM strategy.

You MUST return ONLY a valid JSON object (no markdown, no code fences, no explanation text) with exactly these keys:

{
  "startupSummary": {
    "companyName": "string",
    "industry": "string",
    "productType": "string",
    "stage": "string",
    "tagline": "string"
  },
  "productIntelligence": {
    "problemStatement": "string",
    "solutionDescription": "string",
    "keyFeatures": ["string"],
    "keyBenefits": ["string"],
    "differentiation": "string",
    "complexityLevel": "string",
    "deploymentType": "string",
    "pricingModel": "string"
  },
  "icp": {
    "targetSegments": ["string"],
    "specializations": ["string"],
    "organizationSize": "string",
    "geography": "string",
    "technologyMaturity": "string",
    "annualRevenue": "string"
  },
  "buyerPersona": {
    "primaryBuyer": {
      "title": "string",
      "painPoints": ["string"],
      "motivation": "string"
    },
    "secondaryBuyers": [{ "title": "string", "role": "string" }],
    "buyingTriggers": ["string"]
  },
  "valueProposition": {
    "headline": "string",
    "statements": ["string"],
    "roi": "string"
  },
  "messaging": {
    "elevatorPitch": "string",
    "salesPitch": "string",
    "emailOutreach": { "subject": "string", "body": "string" },
    "linkedinOutreach": "string",
    "tagline": "string",
    "keyMarketingPoints": ["string"]
  },
  "demoStrategy": {
    "workflowSteps": ["string"],
    "talkingPoints": ["string"],
    "objectionHandling": [{ "objection": "string", "response": "string" }]
  },
  "buyerDiscovery": {
    "targetClinicTypes": ["string"],
    "referralPartners": ["string"],
    "strategicPartnerships": ["string"],
    "sampleBuyerProfiles": [{ "orgName": "string", "type": "string", "reason": "string" }]
  },
  "salesStrategy": {
    "approach": "string",
    "funnel": ["string"],
    "conversionDrivers": ["string"],
    "objections": [{ "objection": "string", "solution": "string" }]
  },
  "roiImpact": {
    "revenueImpact": "string",
    "costSavings": "string",
    "efficiencyGain": "string",
    "paybackPeriod": "string",
    "metrics": ["string"]
  },
  "marketplaceMatch": {
    "idealMatches": [{ "clinicType": "string", "reason": "string", "fitScore": number }],
    "recommendedAction": "string"
  }
}

RULES:
- Read and extract information from ALL provided files (PDFs, slides, videos, images, documents)
- Be specific, use healthcare-specific language
- If data is missing, make reasonable expert assumptions
- Output must be investor-ready quality
- Return ONLY the JSON object, nothing else
- VERY IMPORTANT: For 'buyerDiscovery.sampleBuyerProfiles', YOU MUST ONLY select 3-5 organizations from the provided 'BUYER DATASET' in the context. Use their exact 'name' for 'orgName', 'type' for 'type', and provide a 'reason' explaining why they are an ideal fit based on their specific 'key_challenges' and 'specialties'.`,A=new v.GoogleGenerativeAI(process.env.GEMINI_API_KEY||"");function S(){for(let e of[T.default.join(process.cwd(),"data","buyers.json"),T.default.join(process.cwd(),"buyers.json"),T.default.join(process.cwd(),"..","buyers.json"),T.default.join(process.cwd(),"..","data","buyers.json")])try{return E.default.readFileSync(e,"utf-8")}catch{}return null}async function b(e){try{let t,r=await (0,w.createClient)(),a=await e.json();console.log("Analyze API hit",{discoveryMode:a.discoveryMode,startupId:a.startupId});let{files:n,textContext:i,discoveryMode:s,startupId:o}=a;if(s&&o){let{data:e}=await r.from("startup_profiles").select("*").eq("id",o).single();if(!e)return R.NextResponse.json({error:"Startup not found"},{status:404});let{data:t}=await r.from("gtm_recommendations").select("strategy_json").eq("startup_id",o).order("created_at",{ascending:!1}).limit(1).maybeSingle(),a=t?.strategy_json||null,n=S();if(!n)return R.NextResponse.json({error:"Buyer dataset not found"},{status:500});let i=JSON.parse(n);try{let t=A.getGenerativeModel({model:"gemini-2.5-flash"}),r=a?`
          AI-GENERATED GTM STRATEGY (CRITICAL MATCHING CRITERIA):
          - Ideal Customer Profile: ${JSON.stringify(a.icp)}
          - Target Buyer Personas: ${JSON.stringify(a.buyerPersona)}
          - Value Proposition: ${JSON.stringify(a.productIntelligence?.valueProposition)}
          - ROI Impact: ${JSON.stringify(a.roiImpact)}
        `:"",n=`
          You are an expert MedTech Market Analyst. 
          Match this startup to the best 5 potential buyers from the provided dataset. Pay deep attention to the AI-Generated GTM Strategy if provided.
          
          STARTUP PROFILE:
          - Name: ${e.name}
          - Description: ${e.description}
          - Solution Type: ${e.solution_type}
          - Target Market: ${e.target_market}
          ${r}
          
          BUYER DATASET (Top 100 sample):
          ${JSON.stringify(i.slice(0,100))}
          
          TASK:
          1. Select exactly 5 entities from the dataset that have the absolute highest synergy with the startup's profile and GTM strategy.
          2. Assign a match score (0-100).
          3. Provide a 1-sentence "AI Match Rationale" for each explaining WHY they are a perfect fit based on their specific challenges.
          
          RETURN JSON ONLY in this format:
          {
            "matches": [
              { "name": "Contact Person", "organization": "Hospital Name", "score": 95, "reason": "Rationale here" }
            ]
          }
        `,s=(await t.generateContent(n)).response.text().replace(/```json|```/g,"").trim();return R.NextResponse.json(JSON.parse(s))}catch(s){console.warn("Gemini unavailable for discovery, using local keyword matching:",s.message?.substring(0,80));let t=a?JSON.stringify(a).toLowerCase().split(/\W+/):[],r=[e.name,e.description,e.solution_type,e.target_market,e.category,...t].filter(Boolean).join(" ").toLowerCase().split(/\W+/),n=i.map(e=>{let t=[...e.key_challenges||[],...e.match_tags||[],...e.specialties||[],e.name,e.type].join(" ").toLowerCase(),a=0;for(let e of r)e.length>3&&t.includes(e)&&a++;let n=Math.min(98,60+5*a+5*!!e.open_to_pilots+3*("Enterprise"===e.size)),i=e.decision_makers?.[0];return{name:i?.name||"Decision Maker",organization:e.name,score:n,reason:`Matches on ${a} keywords from startup profile. Key challenges: ${(e.key_challenges||[]).slice(0,2).join(", ")}.`}});return n.sort((e,t)=>t.score-e.score),R.NextResponse.json({matches:n.slice(0,5)})}}let l=process.env.GEMINI_API_KEY;if(!l||"your_gemini_api_key_here"===l)return R.NextResponse.json({error:"GEMINI_API_KEY not configured. Add your key to .env.local and restart the dev server."},{status:500});if((!n||0===n.length)&&!i)return R.NextResponse.json({error:"No files or context provided"},{status:400});let c=A.getGenerativeModel({model:"gemini-2.5-flash",systemInstruction:N}),u=[];for(let e of(u.push({text:"Analyze the following healthcare startup documents and generate a complete GTM strategy as JSON:"}),n??[])){let t=x[e.ext.toLowerCase()]??"application/octet-stream";if("application/octet-stream"===t){u.push({text:`[File "${e.name}" could not be read directly — skipping]`});continue}u.push({text:`--- ${e.label.toUpperCase()} (${e.name}) ---`}),u.push({inlineData:{mimeType:t,data:e.base64}})}i?.trim()&&u.push({text:`--- ADDITIONAL CONTEXT ---
${i.trim()}`});let p=S();p?u.push({text:`

--- BUYER DATASET (USE FOR sampleBuyerProfiles) ---
${p}
--- END BUYER DATASET ---
`}):console.warn("[GTM Analyze] Could not load buyers.json dataset from any known path");let d=(await c.generateContent({contents:[{role:"user",parts:u}]})).response.text().trim(),g=d.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/\s*```$/i,"").trim();try{t=JSON.parse(g)}catch{return R.NextResponse.json({raw:d},{status:200})}return R.NextResponse.json({strategy:t},{status:200})}catch(t){console.error("[GTM Analyze Error]",t);let e=t instanceof Error?t.message:"Internal server error";return R.NextResponse.json({error:e},{status:500})}}e.s(["POST",0,b],99239);var P=e.i(99239);let C=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/gtm/analyze/route",pathname:"/api/gtm/analyze",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/OneDrive/Desktop/Mediflow Nexus/Mediflow-Nexus/frontend/app/api/gtm/analyze/route.ts",nextConfigOutput:"",userland:P,...{}}),{workAsyncStorage:I,workUnitAsyncStorage:M,serverHooks:O}=C;async function _(e,t,a){a.requestMeta&&(0,n.setRequestMeta)(e,a.requestMeta),C.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/gtm/analyze/route";v=v.replace(/\/index$/,"")||"/";let R=await C.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!R)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:w,params:E,nextConfig:T,parsedUrl:x,isDraftMode:N,prerenderManifest:A,routerServerContext:S,isOnDemandRevalidate:b,revalidateOnlyGenerated:P,resolvedPathname:I,clientReferenceManifest:M,serverActionsManifest:O}=R,_=(0,o.normalizeAppPath)(v),j=!!(A.dynamicRoutes[_]||A.routes[I]),k=async()=>((null==S?void 0:S.render404)?await S.render404(e,t,x,!1):t.end("This page could not be found"),null);if(j&&!N){let e=!!A.routes[I],t=A.dynamicRoutes[_];if(t&&!1===t.fallback&&!e){if(T.adapterPath)return await k();throw new y.NoFallbackError}}let D=null;!j||C.isDev||N||(D="/index"===(D=I)?"/":D);let U=!0===C.isDev||!j,$=j&&!U;O&&M&&(0,s.setManifestsSingleton)({page:v,clientReferenceManifest:M,serverActionsManifest:O});let G=e.method||"GET",q=(0,i.getTracer)(),H=q.getActiveScopeSpan(),B=!!(null==S?void 0:S.isWrappedByNextServer),L=!!(0,n.getRequestMeta)(e,"minimalMode"),Y=(0,n.getRequestMeta)(e,"incrementalCache")||await C.getIncrementalCache(e,T,A,L);null==Y||Y.resetRequestCache(),globalThis.__incrementalCache=Y;let z={params:E,previewProps:A.preview,renderOpts:{experimental:{authInterrupts:!!T.experimental.authInterrupts},cacheComponents:!!T.cacheComponents,supportsDynamicResponse:U,incrementalCache:Y,cacheLifeProfiles:T.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>C.onRequestError(e,t,a,n,S)},sharedContext:{buildId:w}},F=new l.NodeNextRequest(e),J=new l.NodeNextResponse(t),K=c.NextRequestAdapter.fromNodeNextRequest(F,(0,c.signalFromNodeResponse)(t));try{let n,s=async e=>C.handle(K,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=q.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${G} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),n&&n!==e&&(n.setAttribute("http.route",a),n.updateName(t))}else e.updateName(`${G} ${v}`)}),o=async n=>{var i,o;let l=async({previousCacheEntry:r})=>{try{if(!L&&b&&P&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await s(n);e.fetchMetrics=z.renderOpts.fetchMetrics;let o=z.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=z.renderOpts.collectedTags;if(!j)return await (0,d.sendResponse)(F,J,i,z.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[h.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,a=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await C.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:$,isOnDemandRevalidate:b})},!1,S),t}},c=await C.handleResponse({req:e,nextConfig:T,cacheKey:D,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:b,revalidateOnlyGenerated:P,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:L});if(!j)return null;if((null==c||null==(i=c.value)?void 0:i.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(o=c.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});L||t.setHeader("x-nextjs-cache",b?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,g.fromNodeOutgoingHttpHeaders)(c.value.headers);return L&&j||u.delete(h.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,m.getCacheControlHeader)(c.cacheControl)),await (0,d.sendResponse)(F,J,new Response(c.value.body,{headers:u,status:c.value.status||200})),null};B&&H?await o(H):(n=q.getActiveScopeSpan(),await q.withPropagatedContext(e.headers,()=>q.trace(u.BaseServerSpan.handleRequest,{spanName:`${G} ${v}`,kind:i.SpanKind.SERVER,attributes:{"http.method":G,"http.target":e.url}},o),void 0,!B))}catch(t){if(t instanceof y.NoFallbackError||await C.onRequestError(e,t,{routerKind:"App Router",routePath:_,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:$,isOnDemandRevalidate:b})},!1,S),j)throw t;return await (0,d.sendResponse)(F,J,new Response(null,{status:500})),null}}e.s(["handler",0,_,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:I,workUnitAsyncStorage:M})},"routeModule",0,C,"serverHooks",0,O,"workAsyncStorage",0,I,"workUnitAsyncStorage",0,M],42241)}];

//# sourceMappingURL=0akh_next_dist_esm_build_templates_app-route_0x8feb2.js.map
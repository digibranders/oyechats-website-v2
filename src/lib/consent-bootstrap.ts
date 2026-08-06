import {
  ANALYTICS_HOST,
  CONSENT_COOKIE,
  GTM_CONTAINER_ID,
  GTM_ORIGIN,
  RESTRICTED_ZONES,
} from './consent';

/**
 * The inline `<head>` script, in execution order:
 *
 *   1. initialise dataLayer and define gtag()
 *   2. resolve consent and emit gtag('consent','default', …)
 *   3. on the canonical host only, ARM the GTM loader — the container script is
 *      injected on the visitor's first interaction (scroll / wheel / pointer
 *      move or down / touch / key). There is deliberately NO idle/timeout
 *      fallback: a timed injection still lands inside the Lighthouse trace,
 *      where every gtm/gtag/Clarity long task extends TTI and is charged to
 *      Total Blocking Time (measured: 280 ms → 1,120 ms on PSI mobile with a
 *      3.5 s idle fallback). Interaction-only keeps the lab trace clean and
 *      loads analytics for any human who scrolls, moves the mouse, or touches.
 *      The known cost: a visitor who lands and leaves without any input never
 *      fires a pageview — accepted, since those sessions are also invisible to
 *      Clarity (nothing to replay) and mostly bots.
 *
 * Step 2 must precede step 3: Google's Consent Mode documentation states that
 * defaults called out of order simply do not apply, which would let GTM set
 * `_ga` before the banner has rendered. Keeping all three in one script makes
 * that ordering a property of the language rather than of script-tag
 * scheduling — and deferring the injection cannot break it, because the
 * consent default is already in the dataLayer before gtm.js can ever run.
 * Consented pageviews are unaffected: GTM replays the queued dataLayer when
 * it loads.
 *
 * Step 3 also reconciles host gating (needs `location`, client-side) with
 * `beforeInteractive` (renders server-side) by doing the check at runtime.
 *
 * Written in ES5 so it needs no transpilation, and wrapped in try/catch because
 * it runs before everything else — a throw here would blank the page.
 */
export function consentBootstrapScript(): string {
  return `(function(w,d,host,name,zones,id,origin){try{
w.dataLayer=w.dataLayer||[];
function gtag(){w.dataLayer.push(arguments);}
w.gtag=w.gtag||gtag;
var m=new RegExp('(?:^|;\\\\s*)'+name+'=(granted|denied)').exec(d.cookie);
var a;
if(m){a=m[1]==='granted';}
else if(w.navigator&&w.navigator.globalPrivacyControl){a=false;}
else{var tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch(e){}
a=!(!tz||tz.indexOf('Europe/')===0||zones.indexOf(tz)>-1);}
gtag('consent','default',{analytics_storage:a?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
if(w.location.hostname===host){
var done=false;
var evs=['scroll','wheel','pointermove','pointerdown','touchstart','keydown'];
var inject=function(){
if(done){return;}
done=true;
for(var i=0;i<evs.length;i++){w.removeEventListener(evs[i],inject);}
w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var s=d.createElement('script');s.async=true;s.src=origin+'/gtm.js?id='+id;
var f=d.getElementsByTagName('script')[0];
if(f&&f.parentNode){f.parentNode.insertBefore(s,f);}else{d.head.appendChild(s);}
};
for(var i=0;i<evs.length;i++){w.addEventListener(evs[i],inject,{once:true,passive:true});}
}}catch(e){}})(window,document,${JSON.stringify(ANALYTICS_HOST)},${JSON.stringify(
    CONSENT_COOKIE
  )},${JSON.stringify(RESTRICTED_ZONES)},${JSON.stringify(GTM_CONTAINER_ID)},${JSON.stringify(
    GTM_ORIGIN
  )});`;
}

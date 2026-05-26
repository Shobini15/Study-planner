(async ()=> {
  const fetch = globalThis.fetch || require('node-fetch');
  const email = `e2e+${Date.now()}@test.local`;
  const res = await fetch('http://localhost:5000/api/auth/signup', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name:'E2E User', email, password:'Password123!'})});
  const json = await res.json().catch(()=>null);
  console.log(JSON.stringify(json||''));
  console.log('__EMAIL__:'+email);
})();

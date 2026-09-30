const cidrSelect=document.getElementById("cidr");
for(let i=0;i<=32;i++){let o=document.createElement("option");o.value=i;o.textContent="/"+i; if(i===24)o.selected=true;cidrSelect.appendChild(o)}

function validIP(ip){
  const p=ip.trim().split(".");
  return p.length===4 && p.every(x=>/^\d+$/.test(x)&&+x>=0&&+x<=255);
}
function ipNums(ip){return ip.trim().split(".").map(Number)}
function maskFromCIDR(c){
  return [0,1,2,3].map(i=>{
    const bits=Math.min(8,Math.max(0,c-i*8));
    return bits===0?0:256-Math.pow(2,8-bits);
  });
}
function ipToInt(p){return (((p[0]<<24)>>>0)+((p[1]<<16)>>>0)+((p[2]<<8)>>>0)+p[3])>>>0}
function intToIP(n){return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join(".")}
function calculate(){
  const ip=document.getElementById("ip").value,c=+cidrSelect.value,r=document.getElementById("result");
  if(!validIP(ip)){r.className="result";r.innerHTML='<div class="error" style="grid-column:1/-1">Please enter a valid IPv4 address.</div>';return}
  const p=ipNums(ip),mask=maskFromCIDR(c), n=p.map((x,i)=>x&mask[i]),b=p.map((x,i)=>x|(~mask[i]&255));
  const total=2**(32-c), usable=c>=31?total:Math.max(0,total-2);
  let first="N/A",last="N/A";if(c<31){first=intToIP((ipToInt(n)+1)>>>0);last=intToIP((ipToInt(b)-1)>>>0)}
  const vals=[["IP Address",ip],["CIDR","/"+c],["Subnet Mask",mask.join(".")],["Network Address",n.join(".")],["Broadcast Address",b.join(".")],["First Host",first],["Last Host",last],["Total IPs",total.toLocaleString()],["Usable Hosts",usable.toLocaleString()]];
  r.className="result";r.innerHTML=vals.map(v=>`<div class="stat"><small>${v[0]}</small><b>${v[1]}</b></div>`).join("");
}
function toBinary(){
  const v=document.getElementById("dec").value.trim(),out=document.getElementById("convertResult");
  if(!/^\d+$/.test(v)||+v>255){out.textContent="Enter a decimal value from 0 to 255.";return}
  out.textContent=Number(v).toString(2).padStart(8,"0");
}
function toDecimal(){
  const v=document.getElementById("bin").value.trim(),out=document.getElementById("convertResult");
  if(!/^[01]{8}$/.test(v)){out.textContent="Enter exactly 8 binary digits.";return}
  out.textContent=String(parseInt(v,2));
}
function detectClass(){
  const ip=document.getElementById("classIp").value.trim(),out=document.getElementById("classResult");
  if(!validIP(ip)){out.textContent="Invalid IPv4 address.";return}
  const first=ipNums(ip)[0];let cls,info;
  if(first>=1&&first<=126){cls="Class A";info="Unicast · Default /8";}
  else if(first>=128&&first<=191){cls="Class B";info="Unicast · Default /16";}
  else if(first>=192&&first<=223){cls="Class C";info="Unicast · Default /24";}
  else if(first>=224&&first<=239){cls="Class D";info="Multicast";}
  else if(first>=240&&first<=255){cls="Class E";info="Experimental / Reserved";}
  else{cls="Special";info="0.x.x.x is reserved for special use";}
  out.textContent=`${cls} — ${info}`;
}
calculate();

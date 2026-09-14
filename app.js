/* ===================== DATA MODEL ===================== */
const ROLES = [
  {key:'student', label:'Student'},
  {key:'academic', label:'Academic Office'},
  {key:'dean', label:'Dean Academics'},
  {key:'accounts', label:'Accounts'},
  {key:'sdc', label:'SDC'},
  {key:'ad', label:'Assistant Director'},
];

const state = {
  role:null,
  currentStudentId:'S1',
  rejectingId:null,
  programmes:[
    {key:'AIML', name:'AI & Machine Learning', batchYear:2025, onroll:100, pct:2, seatsFinal:2, finalized:true},
    {key:'CSE',  name:'Computer Science Engg.', batchYear:2025, onroll:500, pct:2, seatsFinal:10, finalized:true},
    {key:'ECE',  name:'Electronics & Comm.',    batchYear:2025, onroll:180, pct:2, seatsFinal:4, finalized:true},
    {key:'MECH', name:'Mechanical Engg.',       batchYear:2025, onroll:120, pct:2, seatsFinal:2, finalized:false},
  ],
  applicants:[
    {id:'S1', name:'Ananya Verma', oldReg:'25BME1042', from:'MECH', cgpa:9.24, programme:null,
      eligibility:'none', appFeeInvoiced:false, appFeePaid:false, allotted:false,
      deanStatus:'none', deanRemarks:'', finalFeeInvoiced:false, finalFeePaid:false, newReg:null, newEmail:null, newPassword:null, eligibilityReason:'',
      dataMigrated:false, checklist:{courses:false,results:false,payments:false,records:false}},
    {id:'S2', name:'Rohit Nair', oldReg:'25BEC1117', from:'ECE', cgpa:8.81, programme:'AIML',
      eligibility:'approved', appFeeInvoiced:true, appFeePaid:true, allotted:false,
      deanStatus:'none', deanRemarks:'', finalFeeInvoiced:false, finalFeePaid:false, newReg:null, newEmail:null, newPassword:null, eligibilityReason:'',
      dataMigrated:false, checklist:{courses:false,results:false,payments:false,records:false}},
    {id:'S3', name:'Sneha Iyer', oldReg:'25BCS1305', from:'CSE', cgpa:9.57, programme:'AIML',
      eligibility:'approved', appFeeInvoiced:true, appFeePaid:true, allotted:true,
      deanStatus:'pending', deanRemarks:'', finalFeeInvoiced:false, finalFeePaid:false, newReg:null, newEmail:null, newPassword:null, eligibilityReason:'',
      dataMigrated:false, checklist:{courses:false,results:false,payments:false,records:false}},
    {id:'S4', name:'Karthik Raj', oldReg:'25BME1099', from:'MECH', cgpa:7.93, programme:'CSE',
      eligibility:'approved', appFeeInvoiced:true, appFeePaid:true, allotted:false,
      deanStatus:'none', deanRemarks:'', finalFeeInvoiced:false, finalFeePaid:false, newReg:null, newEmail:null, newPassword:null, eligibilityReason:'',
      dataMigrated:false, checklist:{courses:false,results:false,payments:false,records:false}},
    {id:'S5', name:'Divya Menon', oldReg:'25BEC1044', from:'ECE', cgpa:8.36, programme:'CSE',
      eligibility:'pending', appFeeInvoiced:false, appFeePaid:false, allotted:false,
      deanStatus:'none', deanRemarks:'', finalFeeInvoiced:false, finalFeePaid:false, newReg:null, newEmail:null, newPassword:null, eligibilityReason:'',
      dataMigrated:false, checklist:{courses:false,results:false,payments:false,records:false}},
    {id:'S6', name:'Arjun Das', oldReg:'25BME1210', from:'MECH', cgpa:9.02, programme:'AIML',
      eligibility:'approved', appFeeInvoiced:true, appFeePaid:true, allotted:true,
      deanStatus:'approved', deanRemarks:'Approved on merit.', finalFeeInvoiced:true, finalFeePaid:false, newReg:null, newEmail:null, newPassword:null, eligibilityReason:'',
      dataMigrated:false, checklist:{courses:false,results:false,payments:false,records:false}},
    {id:'S7', name:'Priya Kumar', oldReg:'25BEC1080', from:'ECE', cgpa:8.5, programme:'AIML',
      eligibility:'approved', appFeeInvoiced:true, appFeePaid:true, allotted:true,
      deanStatus:'approved', deanRemarks:'Approved.', finalFeeInvoiced:true, finalFeePaid:true,
      newReg:'26AIM4021', newEmail:'26aim4021@university.edu.in', newPassword:'Aep@2026', eligibilityReason:'',
      dataMigrated:true, checklist:{courses:true,results:true,payments:true,records:true}},
  ],
};

const STAGES = ['Applied','Invoice Generated','Application Fee Paid','Allotted (Merit)','Dean Approved','Final Fee Paid','Reg. No. & Email Issued','Account Migrated (Completed)'];
const CHECKLIST_ITEMS = [
  {key:'courses', label:'Courses & Enrollment'},
  {key:'results', label:'Results & Grading'},
  {key:'payments', label:'Payment / Fee Records'},
  {key:'records', label:'Other Academic Records'},
];

function seatCount(p){ return Math.max(1, p.seatsFinal); }
function suggestedSeats(p){ return Math.max(1, Math.round(p.onroll * p.pct/100)); }
function appliedCountFor(progKey){ return state.applicants.filter(a=>a.programme===progKey).length; }
function stu(id){ return state.applicants.find(a=>a.id===id); }
function prog(key){ return state.programmes.find(p=>p.key===key); }
function checklistDone(a){ return CHECKLIST_ITEMS.every(i=>a.checklist[i.key]); }

function computeStage(a){
  if(a.dataMigrated) return 7;
  if(a.newEmail) return 6;
  if(a.finalFeePaid) return 5;
  if(a.deanStatus==='approved') return 4;
  if(a.allotted) return 3;
  if(a.appFeePaid) return 2;
  if(a.appFeeInvoiced) return 1;
  if(a.programme) return 0;
  return -1;
}
function allottedCountFor(progKey){ return state.applicants.filter(a=>a.programme===progKey && a.allotted).length; }

/* ===================== TOAST ===================== */
let toastTimer;
function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'), 2800);
}

/* ===================== LOGIN ===================== */
let selectedRole='student';
function renderRoleTabs(){
  document.getElementById('role-tabs').innerHTML = ROLES.map(r=>
    `<div class="role-pill ${r.key===selectedRole?'active':''}" onclick="selectRole('${r.key}')">${r.label}</div>`).join('');
}
function selectRole(k){ selectedRole=k; renderRoleTabs(); }
function doLogin(){
  state.role=selectedRole;
  document.getElementById('login-screen').style.display='none';
  document.getElementById('app-screen').style.display='block';
  renderShell();
}
function logout(){
  document.getElementById('app-screen').style.display='none';
  document.getElementById('login-screen').style.display='flex';
  state.role=null;
}
renderRoleTabs();

/* ===================== SHELL ===================== */
const NAV = {
  student:[{k:'dash',l:'My Migration'}],
  academic:[{k:'overview',l:'Overview'},{k:'programmes',l:'Programme List'},{k:'applications',l:'Applications & Eligibility'},{k:'merit',l:'Merit & Allotment'},{k:'finalfee',l:'Final Fee (₹9,000)'}],
  dean:[{k:'pending',l:'Pending Approval'},{k:'history',l:'Decision History'}],
  accounts:[{k:'invoices',l:'All Invoices'}],
  sdc:[{k:'regno',l:'Registration Numbers'},{k:'migrate',l:'Data Migration'}],
  ad:[{k:'email',l:'Email Issuance'}],
};
let currentNav=null;
function roleLabel(k){ return ROLES.find(r=>r.key===k).label; }
function renderShell(){
  document.getElementById('sb-role').textContent = roleLabel(state.role);
  const names = {student:'Ananya Verma', academic:'Academic Office Desk', dean:'Dean Academics', accounts:'Accounts Desk', sdc:'SDC Desk', ad:'Assistant Director'};
  document.getElementById('sb-user').textContent = names[state.role];
  currentNav = NAV[state.role][0].k;
  renderNav(); renderMain();
}
function renderNav(){
  document.getElementById('sb-nav').innerHTML = NAV[state.role].map(i=>
    `<a class="${i.k===currentNav?'active':''}" onclick="goto('${i.k}')"><span class="dot"></span>${i.l}</a>`).join('');
}
function goto(k){ currentNav=k; renderNav(); renderMain(); }
function renderMain(){
  ({student:renderStudent, academic:renderAcademic, dean:renderDean, accounts:renderAccounts, sdc:renderSDC, ad:renderAD})[state.role]();
}

/* ===================== SHARED STEPPER ===================== */
function stepperHtml(a){
  const stage = computeStage(a);
  const notes = {
    0:'Awaiting eligibility check by Academic Office',
    1:'Invoice generated — pay to proceed',
    2:'In merit pool — awaiting allotment',
    3:'Awaiting Dean Academics approval',
    4:'Pay the final migration fee to proceed',
    5:'Awaiting Registration No. and Email from SDC / Assistant Director',
    6:'SDC is migrating courses, results and payment records to your new login',
    7:'Migration complete',
  };
  return `<div class="v-stepper">${STAGES.map((s,i)=>`
    <div class="v-step ${i<stage?'done':(i===stage?'current':'')}">
      <div class="rail"><div class="circle">${i<stage?'✓':(i+1)}</div>${i<STAGES.length-1?'<div class="bar"></div>':''}</div>
      <div class="body"><div class="title">${s}</div>${i===stage?`<div class="note">${notes[stage]||''}</div>`:''}</div>
    </div>`).join('')}</div>`;
}

/* ===================== STUDENT LIST MODAL (click-through on numbers) ===================== */
function statusBadgeCell(a){
  if(a.eligibility==='rejected') return '<span class="badge badge-red">Not Eligible</span>';
  if(a.deanStatus==='rejected') return '<span class="badge badge-red">Dean Rejected</span>';
  const stage=computeStage(a);
  return `<span class="badge ${stage>=7?'badge-green':'badge-amber'}">${STAGES[Math.max(stage,0)]}</span>`;
}
function reasonCell(a){
  if(a.eligibility==='rejected') return a.eligibilityReason||'—';
  if(a.deanStatus==='rejected') return a.deanRemarks||'—';
  return '—';
}
const COL_BASE = [
  {header:'Name', cell:a=>a.name},
  {header:'Reg. No.', cell:a=>`<span class="num">${a.oldReg}</span>`},
  {header:'Programme', cell:a=>a.programme?prog(a.programme).name:'—'},
];
const COL_STATUS = {header:'Status', cell:statusBadgeCell};
const COL_REASON = {header:'Reason / Remarks', cell:reasonCell};

function openModal(title, list, columns){
  const rows = list.map(a=>`<tr>${columns.map(c=>`<td>${c.cell(a)}</td>`).join('')}</tr>`).join('');
  document.getElementById('modal-root').innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this) closeModal()">
      <div class="modal-panel">
        <div class="flex-between" style="margin-bottom:16px;">
          <h3>${title} <span class="badge badge-navy">${list.length}</span></h3>
          <span class="modal-close" onclick="closeModal()">✕</span>
        </div>
        ${list.length===0 ? '<p style="color:var(--slate);">No students in this category.</p>' : `
        <table><thead><tr>${columns.map(c=>`<th>${c.header}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody></table>`}
      </div>
    </div>`;
}
function closeModal(){ document.getElementById('modal-root').innerHTML=''; }

/* Academic Office overview drill-downs */
function showTotalApplications(){ openModal('Total Applications', state.applicants.filter(a=>a.programme), [...COL_BASE,COL_STATUS,COL_REASON]); }
function showEligibilityPending(){ openModal('Eligibility Pending', state.applicants.filter(a=>a.eligibility==='pending'), [...COL_BASE,COL_STATUS]); }
function showFeePaidList(){ openModal('Application Fee Paid', state.applicants.filter(a=>a.appFeePaid), [...COL_BASE,COL_STATUS]); }
function showAllottedList(){ openModal('Allotted (Manual)', state.applicants.filter(a=>a.allotted), [...COL_BASE,COL_STATUS]); }
function showDeanApprovedList(){ openModal('Dean Approved', state.applicants.filter(a=>a.deanStatus==='approved'), [...COL_BASE,COL_STATUS]); }
function showEmailIssuedList(){ openModal('Email Issued', state.applicants.filter(a=>a.newEmail), [...COL_BASE,COL_STATUS]); }
function showFullyMigratedList(){ openModal('Fully Migrated (SDC)', state.applicants.filter(a=>a.dataMigrated), [...COL_BASE,COL_STATUS]); }

/* Accounts drill-downs */
function showTotalCollectedList(){
  openModal('All Payments', state.applicants.filter(a=>a.appFeePaid||a.finalFeePaid), [...COL_BASE,
    {header:'App. Fee (₹1,000)', cell:a=>a.appFeePaid?'<span class="badge badge-green">Paid</span>':'—'},
    {header:'Final Fee (₹9,000)', cell:a=>a.finalFeePaid?'<span class="badge badge-green">Paid</span>':'—'}]);
}
function showAppFeePaymentsList(){ openModal('Application Fee Payments', state.applicants.filter(a=>a.appFeePaid), [...COL_BASE, {header:'Amount', cell:()=>'₹1,000'}]); }
function showFinalFeePaymentsList(){ openModal('Final Fee Payments', state.applicants.filter(a=>a.finalFeePaid), [...COL_BASE, {header:'Amount', cell:()=>'₹9,000'}]); }

/* ===================== STUDENT ===================== */
function renderStudent(){
  const s = stu(state.currentStudentId);
  const stage = computeStage(s);
  document.getElementById('main').innerHTML = `
    <div class="page-head">
      <div><div class="eyebrow">Student Dashboard</div><h1>My Migration</h1><p>Current record: ${s.oldReg} · ${s.from}</p></div>
      <span class="badge ${stage>=7?'badge-green':'badge-amber'}">${STAGES[Math.max(stage,0)]}</span>
    </div>

    ${s.deanStatus==='approved' ? `<div class="banner-success">🎉 Congratulations — your migration to <strong>${prog(s.programme).name}</strong> has been approved by Dean Academics.</div>` : ''}
    ${s.dataMigrated ? `<div class="banner-success">🎉 Congratulations — your migration to <strong>${prog(s.programme).name}</strong> is complete! Your new VTOP username is <strong>${s.newReg}</strong> with the password set by SDC. All your courses, results and payment history have been moved to this new login.</div>` : ''}
    ${s.eligibility==='rejected' ? `<div class="note-box" style="background:var(--red-bg);color:var(--red);border-color:#F3C9C9;">Your application was marked <strong>not eligible</strong> by the Academic Office. Reason: ${s.eligibilityReason||'—'}</div>` : ''}
    ${s.deanStatus==='rejected' ? `<div class="note-box" style="background:var(--red-bg);color:var(--red);border-color:#F3C9C9;">Dean Academics did not approve this migration. Remarks: ${s.deanRemarks||'—'}</div>` : ''}

    <div class="grid grid-2">
      <div class="card">
        <h3>Choose Migrating Programme</h3>
        <p class="desc">Only programmes finalized by the Academic Office are shown.</p>
        ${!s.programme ? `
          <select id="prog-select">${state.programmes.filter(p=>p.finalized).map(p=>`<option value="${p.key}">${p.name}</option>`).join('')}</select>
          ${state.programmes.filter(p=>p.finalized).length===0
            ? '<div class="note-box" style="margin-top:10px;">No programmes finalized by the Academic Office yet.</div>'
            : '<div style="margin-top:12px;"><button class="btn btn-sky btn-sm" onclick="applyProgramme()">Apply for Migration</button></div>'}
        ` : `<span class="badge badge-navy">Applied to: ${prog(s.programme).name}</span>`}
      </div>

      <div class="card">
        <h3>Application Fee — ₹1,000</h3>
        ${!s.programme ? `<div class="note-box">Choose a programme first.</div>` : ''}
        ${s.programme && s.eligibility==='none' ? `<div class="note-box">Awaiting eligibility check by Academic Office.</div>` : ''}
        ${s.eligibility==='approved' && !s.appFeePaid ? (s.appFeeInvoiced
          ? `<div class="badge badge-green" style="margin-bottom:12px;">Invoice Generated</div><br><button class="btn btn-primary" style="width:auto;" onclick="payAppFee()">Pay ₹1,000</button>`
          : `<div class="note-box">Eligible — invoice will appear here once Academic Office generates it.</div>`) : ''}
        ${s.appFeePaid ? `<div class="flex-between"><span class="badge badge-green">Fee Paid</span><button class="btn btn-outline btn-sm" onclick="showToast('AppFee_Invoice_${s.oldReg}.pdf downloaded (simulated)')">⬇ Receipt</button></div>` : ''}
      </div>
    </div>

    <div class="grid grid-2" style="margin-top:16px;">
      <div class="card">
        <h3>Final Migration Fee — ₹9,000</h3>
        ${s.deanStatus!=='approved' ? `<div class="note-box">Generated only after Dean Academics approves your allotment.</div>` : ''}
        ${s.deanStatus==='approved' && !s.finalFeePaid ? (s.finalFeeInvoiced
          ? `<div class="badge badge-green" style="margin-bottom:12px;">Invoice Generated</div><br><button class="btn btn-primary" style="width:auto;" onclick="payFinalFee()">Pay ₹9,000</button>`
          : `<div class="note-box">Approved — awaiting invoice from Academic Office.</div>`):''}
        ${s.finalFeePaid ? `<div class="flex-between"><span class="badge badge-green">Fee Paid</span><button class="btn btn-outline btn-sm" onclick="showToast('FinalFee_Invoice_${s.oldReg}.pdf downloaded (simulated)')">⬇ Receipt</button></div>`:''}
      </div>
      <div class="card">
        <h3>Registration No. &amp; Email</h3>
        <table><tbody>
          <tr><td>New Registration No. (Username)</td><td class="num">${s.newReg||'Pending — SDC'}</td></tr>
          <tr><td>New Password</td><td class="num">${s.newPassword||'Pending — SDC'}</td></tr>
          <tr><td>New Official Email</td><td class="num">${s.newEmail||'Pending — Assistant Director'}</td></tr>
        </tbody></table>
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <h3>Data Migration — Old Login → New Login</h3>
      <p class="desc">Courses, results/grading and payment history being moved from your old login to the new one. Handled by SDC.</p>
      ${!s.newEmail ? `<div class="note-box">Will begin once your new Registration No. and Email are issued.</div>` : `
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${CHECKLIST_ITEMS.map(item=>`<span class="badge ${s.checklist[item.key]?'badge-green':'badge-amber'}">${s.checklist[item.key]?'✓ ':''}${item.label}</span>`).join('')}
        </div>
        <div style="margin-top:12px;">${s.dataMigrated
          ? `<span class="badge badge-green">Fully Migrated — Old login retired</span>`
          : `<span class="badge badge-amber">In Progress</span>`}</div>
      `}
    </div>

    <div class="card" style="margin-top:16px;">
      <h3>Progress Tracker</h3>
      ${stepperHtml(s)}
    </div>
  `;
}
function applyProgramme(){
  const s=stu(state.currentStudentId);
  s.programme=document.getElementById('prog-select').value;
  renderStudent(); showToast('Application submitted for '+prog(s.programme).name);
}
function payAppFee(){ const s=stu(state.currentStudentId); s.appFeePaid=true; renderStudent(); showToast('Application fee paid'); }
function payFinalFee(){ const s=stu(state.currentStudentId); s.finalFeePaid=true; renderStudent(); showToast('Final migration fee paid'); }

/* ===================== ACADEMIC OFFICE ===================== */
function renderAcademic(){
  ({overview:renderAOOverview, programmes:renderAOProgrammes, applications:renderAOApplications, merit:renderAOMerit, finalfee:renderAOFinalFee})[currentNav]();
}
function renderAOOverview(){
  const a=state.applicants;
  const cards=[
    ['Total Applications', a.filter(x=>x.programme).length, 'showTotalApplications'],
    ['Eligibility Pending', a.filter(x=>x.eligibility==='pending').length, 'showEligibilityPending'],
    ['Fee Paid', a.filter(x=>x.appFeePaid).length, 'showFeePaidList'],
    ['Allotted (Manual)', a.filter(x=>x.allotted).length, 'showAllottedList'],
    ['Dean Approved', a.filter(x=>x.deanStatus==='approved').length, 'showDeanApprovedList'],
    ['Email Issued', a.filter(x=>x.newEmail).length, 'showEmailIssuedList'],
    ['Fully Migrated (SDC)', a.filter(x=>x.dataMigrated).length, 'showFullyMigratedList'],
  ];
  document.getElementById('main').innerHTML = `
    <div class="page-head"><div><div class="eyebrow">Academic Office</div><h1>Migration Overview</h1><p>Overall process lead — applications, eligibility, invoicing and statistics. Click any number to see the students.</p></div></div>
    <div class="grid grid-3">${cards.map(c=>`<div class="card stat-card clickable" onclick="${c[2]}()"><div class="num">${c[1]}</div><div class="lbl">${c[0]}</div></div>`).join('')}</div>
  `;
}
function renderAOProgrammes(){
  document.getElementById('main').innerHTML = `
    <div class="page-head"><div><div class="eyebrow">Academic Office</div><h1>Programme List &amp; Seat Statistics</h1><p>Finalize on-roll strength and migration seats first — students can only see and apply to a programme after it is finalized here.</p></div></div>

    <div class="card" style="margin-bottom:18px;">
      <h3>Create New Programme</h3>
      <p class="desc">Add a programme/batch so it appears in this list. It stays in Draft until you finalize it.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;">
        <div style="min-width:150px;"><label style="display:block;font-size:11.5px;font-weight:600;color:var(--slate);margin-bottom:5px;">Programme Code</label>
          <input type="text" id="new-key" placeholder="e.g. CSBS" style="width:100%;padding:9px 11px;border:1.5px solid var(--line);border-radius:8px;font-size:13px;"></div>
        <div style="min-width:200px;flex:1;"><label style="display:block;font-size:11.5px;font-weight:600;color:var(--slate);margin-bottom:5px;">Programme Name</label>
          <input type="text" id="new-name" placeholder="e.g. Computer Science &amp; Business Systems" style="width:100%;padding:9px 11px;border:1.5px solid var(--line);border-radius:8px;font-size:13px;"></div>
        <div style="min-width:100px;"><label style="display:block;font-size:11.5px;font-weight:600;color:var(--slate);margin-bottom:5px;">Batch Year</label>
          <input type="number" id="new-batch" value="2025" style="width:100%;padding:9px 11px;border:1.5px solid var(--line);border-radius:8px;font-size:13px;"></div>
        <div style="min-width:110px;"><label style="display:block;font-size:11.5px;font-weight:600;color:var(--slate);margin-bottom:5px;">On-roll Students</label>
          <input type="number" id="new-onroll" min="1" placeholder="e.g. 500" style="width:100%;padding:9px 11px;border:1.5px solid var(--line);border-radius:8px;font-size:13px;"></div>
        <div style="min-width:130px;"><label style="display:block;font-size:11.5px;font-weight:600;color:var(--slate);margin-bottom:5px;">Final Migration Seats</label>
          <input type="number" id="new-seats" min="1" placeholder="e.g. 10" style="width:100%;padding:9px 11px;border:1.5px solid var(--line);border-radius:8px;font-size:13px;"></div>
        <button class="btn btn-sky btn-sm" onclick="addProgramme()">+ Add Programme</button>
      </div>
    </div>

    <div class="grid grid-2">
      ${state.programmes.map(p=>{
        const filled = allottedCountFor(p.key), cap = seatCount(p), applied = appliedCountFor(p.key);
        return `
        <div class="card">
          <div class="flex-between">
            <div><div class="eyebrow" style="margin-bottom:2px;">Batch ${p.batchYear}</div><h3 style="margin:0;">${p.name}</h3></div>
            <span class="badge ${p.finalized?'badge-green':'badge-amber'}">${p.finalized?'Finalized · Visible to Students':'Draft · Hidden'}</span>
          </div>
          <div class="gauge-wrap" style="margin-top:14px;">
            ${gaugeSvg(filled,cap)}
            <div><div class="head-font" style="font-size:19px;font-weight:700;">${cap} migration seats</div>
            <div style="font-size:11.5px;color:var(--slate);">Allotted: ${filled} / ${cap}</div></div>
          </div>
          <table style="margin-top:14px;">
            <tbody>
              <tr><td style="width:52%;">On-roll Students (${p.batchYear} batch)</td>
                <td><div style="display:flex;gap:6px;"><input type="number" min="1" id="onroll-${p.key}" value="${p.onroll}" style="width:90px;padding:7px 9px;border:1.5px solid var(--line);border-radius:8px;font-size:13px;">
                <button class="btn btn-outline btn-sm" onclick="updateOnroll('${p.key}')">Update</button></div></td></tr>
              <tr><td>Suggested Seats (2% of on-roll)</td><td class="num">${suggestedSeats(p)}</td></tr>
              <tr><td>Final Migration Seats (manual)</td>
                <td><div style="display:flex;gap:6px;"><input type="number" min="1" id="seats-${p.key}" value="${p.seatsFinal}" style="width:90px;padding:7px 9px;border:1.5px solid var(--line);border-radius:8px;font-size:13px;">
                <button class="btn btn-outline btn-sm" onclick="updateSeatsFinal('${p.key}')">Save</button></div></td></tr>
              <tr><td>Applications Received</td><td class="num">${applied} student${applied===1?'':'s'} registered</td></tr>
            </tbody>
          </table>
          <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn ${p.finalized?'btn-outline':'btn-sky'} btn-sm" onclick="toggleFinalize('${p.key}')">${p.finalized?'Unpublish (Move to Draft)':'Finalize & Publish to Students'}</button>
            ${applied===0 ? `<button class="btn btn-danger btn-sm" onclick="removeProgramme('${p.key}')">Remove</button>` : ''}
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
}
function addProgramme(){
  const key = (document.getElementById('new-key').value||'').trim().toUpperCase();
  const name = (document.getElementById('new-name').value||'').trim();
  const batchYear = parseInt(document.getElementById('new-batch').value,10);
  const onroll = parseInt(document.getElementById('new-onroll').value,10);
  const seatsFinal = parseInt(document.getElementById('new-seats').value,10);
  if(!key || !name || !batchYear || !onroll || !seatsFinal){ showToast('Fill in all fields to add a programme'); return; }
  if(state.programmes.some(p=>p.key===key)){ showToast('A programme with that code already exists'); return; }
  state.programmes.push({key, name, batchYear, onroll, pct:2, seatsFinal, finalized:false});
  renderAOProgrammes(); showToast(name+' added — currently in Draft, not yet visible to students');
}
function removeProgramme(key){
  state.programmes = state.programmes.filter(p=>p.key!==key);
  renderAOProgrammes(); showToast('Programme removed');
}
function gaugeSvg(filled,cap){
  const r=24, c=2*Math.PI*r;
  const pct = cap>0 ? Math.min(1, filled/cap) : 0;
  return `<svg width="58" height="58" class="gauge"><circle cx="29" cy="29" r="${r}" fill="none" stroke="var(--sky-soft)" stroke-width="6"/>
    <circle cx="29" cy="29" r="${r}" fill="none" stroke="var(--sky)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-pct)}"/></svg>`;
}
function updateOnroll(key){
  const val = parseInt(document.getElementById('onroll-'+key).value, 10);
  if(!val || val<1){ showToast('Enter a valid on-roll count'); return; }
  prog(key).onroll = val;
  renderAOProgrammes(); showToast('On-roll strength updated for '+prog(key).name);
}
function updateSeatsFinal(key){
  const val = parseInt(document.getElementById('seats-'+key).value, 10);
  if(!val || val<1){ showToast('Enter a valid seat count'); return; }
  prog(key).seatsFinal = val;
  renderAOProgrammes(); showToast('Final migration seats set to '+val+' for '+prog(key).name);
}
function toggleFinalize(key){
  const p=prog(key); p.finalized=!p.finalized;
  renderAOProgrammes();
  showToast(p.finalized ? p.name+' finalized — now visible to students' : p.name+' moved back to draft — hidden from students');
}

function renderAOApplications(){
  const list = state.applicants.filter(a=>a.programme);
  document.getElementById('main').innerHTML = `
    <div class="page-head"><div><div class="eyebrow">Academic Office</div><h1>Applications &amp; Eligibility</h1><p>Check eligibility, then generate the ₹1,000 application-fee invoice for eligible students.</p></div></div>
    <div class="card">
      <table>
        <thead><tr><th>Name</th><th>Reg. No.</th><th>From</th><th>Programme</th><th>CGPA</th><th>Eligibility</th><th>Invoice</th><th>Paid</th></tr></thead>
        <tbody>
          ${list.map(a=>`
            <tr>
              <td>${a.name}</td><td class="num">${a.oldReg}</td><td>${a.from}</td><td>${prog(a.programme).name}</td><td class="num">${a.cgpa}</td>
              <td style="min-width:200px;">${eligibilityCell(a)}</td>
              <td>${a.eligibility==='approved' ? (a.appFeeInvoiced?'<span class="badge badge-navy">Generated</span>':`<button class="btn btn-sky btn-sm" onclick="genAppInvoice('${a.id}')">Generate ₹1,000</button>`) : '—'}</td>
              <td>${a.appFeePaid?'<span class="badge badge-green">Paid</span>':(a.appFeeInvoiced?'<span class="badge badge-amber">Pending</span>':'—')}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}
function eligibilityCell(a){
  if(a.eligibility==='approved') return '<span class="badge badge-green">Eligible</span>';
  if(a.eligibility==='rejected') return `<span class="badge badge-red">Not Eligible</span><div class="hint" style="margin-top:5px;color:var(--slate);">Reason: ${a.eligibilityReason||'—'}</div>`;
  if(state.rejectingId===a.id) return `
    <div style="display:flex;gap:6px;">
      <input type="text" id="reject-reason-${a.id}" placeholder="Rejection reason" style="flex:1;min-width:130px;padding:8px 10px;border:1.5px solid var(--line);border-radius:8px;font-size:12.5px;">
      <button class="btn btn-danger btn-sm" onclick="confirmReject('${a.id}')">Confirm</button>
      <button class="btn btn-outline btn-sm" onclick="cancelReject()">Cancel</button>
    </div>`;
  return `<button class="btn btn-outline btn-sm" onclick="setEligibility('${a.id}','approved')">Approve</button>
    <button class="btn btn-danger btn-sm" onclick="startReject('${a.id}')">Reject</button>`;
}
function setEligibility(id,val){ stu(id).eligibility=val; renderAOApplications(); showToast('Eligibility '+val+' for '+stu(id).name); }
function startReject(id){ state.rejectingId=id; renderAOApplications(); }
function cancelReject(){ state.rejectingId=null; renderAOApplications(); }
function confirmReject(id){
  const input = document.getElementById('reject-reason-'+id);
  const reason = (input.value||'').trim();
  if(!reason){ showToast('Enter a rejection reason before confirming'); return; }
  const a=stu(id); a.eligibility='rejected'; a.eligibilityReason=reason; state.rejectingId=null;
  renderAOApplications(); showToast('Application rejected for '+a.name);
}
function genAppInvoice(id){ stu(id).appFeeInvoiced=true; renderAOApplications(); showToast('₹1,000 invoice generated for '+stu(id).name); }

function renderAOMerit(){
  const pool = state.applicants.filter(a=>a.appFeePaid);
  document.getElementById('main').innerHTML = `
    <div class="page-head"><div><div class="eyebrow">Academic Office</div><h1>Merit List &amp; Allotment</h1><p>Ranked by CGPA within each programme. Allotment is a manual selection by the Academic Office, not automatic.</p></div></div>
    <div class="card">
      <table>
        <thead><tr><th>Name</th><th>Reg. No.</th><th>Programme (Preference)</th><th>CGPA</th><th>Final Seats</th><th>Filled</th><th>Action</th></tr></thead>
        <tbody>
          ${pool.slice().sort((a,b)=>b.cgpa-a.cgpa).map(a=>{
            const p=prog(a.programme); const cap=seatCount(p); const filled=allottedCountFor(p.key);
            return `<tr>
              <td>${a.name}</td><td class="num">${a.oldReg}</td><td>${p.name}</td><td class="num">${a.cgpa}</td>
              <td class="num">${cap}</td><td class="num">${filled}/${cap}</td>
              <td>${a.allotted ? '<span class="badge badge-green">Allotted</span>' :
                  (filled>=cap ? '<span class="badge badge-red">Seats Full</span>' :
                  `<button class="btn btn-sky btn-sm" onclick="manualAllot('${a.id}')">Allocate</button>`)}</td>
            </tr>`;
          }).join('')}
          ${pool.length===0?'<tr><td colspan="7" style="color:var(--slate);">No fee-paid applicants yet.</td></tr>':''}
        </tbody>
      </table>
      <p class="hint">Selection is manual — the Academic Office reviews the ranked list and clicks Allocate for chosen students, up to the seat cap.</p>
    </div>
  `;
}
function manualAllot(id){
  const a=stu(id); const p=prog(a.programme);
  if(allottedCountFor(p.key)>=seatCount(p)){ showToast('Seats already full for '+p.name); return; }
  a.allotted=true; a.deanStatus='pending';
  renderAOMerit(); showToast(a.name+' allotted to '+p.name+' — sent to Dean Academics for approval');
}

function renderAOFinalFee(){
  const approved = state.applicants.filter(a=>a.deanStatus==='approved');
  document.getElementById('main').innerHTML = `
    <div class="page-head"><div><div class="eyebrow">Academic Office</div><h1>Final Migration Fee — ₹9,000</h1><p>Generated only for students approved by Dean Academics.</p></div></div>
    <div class="card">
      <table>
        <thead><tr><th>Name</th><th>Reg. No.</th><th>Programme</th><th>Invoice</th><th>Payment</th></tr></thead>
        <tbody>
          ${approved.map(a=>`
            <tr><td>${a.name}</td><td class="num">${a.oldReg}</td><td>${prog(a.programme).name}</td>
            <td>${a.finalFeeInvoiced?'<span class="badge badge-navy">Generated</span>':`<button class="btn btn-sky btn-sm" onclick="genFinalInvoice('${a.id}')">Generate ₹9,000</button>`}</td>
            <td>${a.finalFeePaid?'<span class="badge badge-green">Paid</span>':(a.finalFeeInvoiced?'<span class="badge badge-amber">Pending</span>':'—')}</td></tr>
          `).join('')}
          ${approved.length===0?'<tr><td colspan="5" style="color:var(--slate);">No Dean-approved students yet.</td></tr>':''}
        </tbody>
      </table>
    </div>
  `;
}
function genFinalInvoice(id){ stu(id).finalFeeInvoiced=true; renderAOFinalFee(); showToast('₹9,000 final fee invoice generated for '+stu(id).name); }

/* ===================== DEAN ACADEMICS ===================== */
function renderDean(){ currentNav==='pending' ? renderDeanPending() : renderDeanHistory(); }
function renderDeanPending(){
  const pending = state.applicants.filter(a=>a.allotted && a.deanStatus==='pending');
  document.getElementById('main').innerHTML = `
    <div class="page-head"><div><div class="eyebrow">Dean Academics</div><h1>Pending Approval</h1><p>Final approval of migrations allotted by the Academic Office.</p></div></div>
    <div class="card">
      ${pending.length===0?'<p style="color:var(--slate);">Nothing pending right now.</p>':pending.map(a=>`
        <div style="padding:14px 0;border-bottom:1px solid var(--line);">
          <div class="flex-between">
            <div><strong>${a.name}</strong> <span class="num" style="color:var(--slate);">(${a.oldReg})</span> → ${prog(a.programme).name} · CGPA ${a.cgpa}</div>
          </div>
          <textarea id="remarks-${a.id}" placeholder="Remarks (optional)" style="margin-top:8px;"></textarea>
          <div style="margin-top:8px;display:flex;gap:8px;">
            <button class="btn btn-sky btn-sm" onclick="deanDecide('${a.id}','approved')">Approve</button>
            <button class="btn btn-danger btn-sm" onclick="deanDecide('${a.id}','rejected')">Reject</button>
          </div>
        </div>`).join('')}
    </div>
  `;
}
function deanDecide(id,decision){
  const a=stu(id);
  const remarksEl=document.getElementById('remarks-'+id);
  a.deanStatus=decision;
  a.deanRemarks=remarksEl?remarksEl.value:'';
  renderDeanPending();
  showToast(decision==='approved' ? a.name+' approved — student notified' : a.name+' rejected');
}
function renderDeanHistory(){
  const done = state.applicants.filter(a=>a.deanStatus==='approved'||a.deanStatus==='rejected');
  document.getElementById('main').innerHTML = `
    <div class="page-head"><div><div class="eyebrow">Dean Academics</div><h1>Decision History</h1><p>All approved and rejected migration decisions.</p></div></div>
    <div class="card">
      <table>
        <thead><tr><th>Name</th><th>Programme</th><th>Decision</th><th>Remarks</th></tr></thead>
        <tbody>${done.map(a=>`<tr><td>${a.name}</td><td>${prog(a.programme).name}</td>
          <td>${a.deanStatus==='approved'?'<span class="badge badge-green">Approved</span>':'<span class="badge badge-red">Rejected</span>'}</td>
          <td>${a.deanRemarks||'—'}</td></tr>`).join('')}
          ${done.length===0?'<tr><td colspan="4" style="color:var(--slate);">No decisions yet.</td></tr>':''}
        </tbody>
      </table>
    </div>
  `;
}

/* ===================== ACCOUNTS (read-only) ===================== */
function renderAccounts(){
  const list = state.applicants.filter(a=>a.appFeeInvoiced||a.finalFeeInvoiced);
  const total = state.applicants.reduce((sum,a)=>sum+(a.appFeePaid?1000:0)+(a.finalFeePaid?9000:0),0);
  document.getElementById('main').innerHTML = `
    <div class="page-head"><div><div class="eyebrow">Accounts</div><h1>All Invoices</h1><p>Read-only view of every invoice generated by the Academic Office.</p></div></div>
    <div class="grid grid-3">
      <div class="card stat-card clickable" onclick="showTotalCollectedList()"><div class="num">₹${total.toLocaleString('en-IN')}</div><div class="lbl">Total Collected</div></div>
      <div class="card stat-card clickable" onclick="showAppFeePaymentsList()"><div class="num">${state.applicants.filter(a=>a.appFeePaid).length}</div><div class="lbl">App. Fee Payments</div></div>
      <div class="card stat-card clickable" onclick="showFinalFeePaymentsList()"><div class="num">${state.applicants.filter(a=>a.finalFeePaid).length}</div><div class="lbl">Final Fee Payments</div></div>
    </div>
    <div class="card" style="margin-top:16px;">
      <div class="flex-between"><h3>Invoice Log</h3><button class="btn btn-outline btn-sm" onclick="showToast('invoice_report.csv exported (simulated)')">⬇ Export CSV</button></div>
      <table>
        <thead><tr><th>Name</th><th>Reg. No.</th><th>App. Fee (₹1,000)</th><th>Final Fee (₹9,000)</th></tr></thead>
        <tbody>
        ${list.map(a=>`<tr><td>${a.name}</td><td class="num">${a.oldReg}</td>
          <td>${a.appFeeInvoiced?(a.appFeePaid?'<span class="badge badge-green">Paid</span>':'<span class="badge badge-amber">Pending</span>'):'—'}</td>
          <td>${a.finalFeeInvoiced?(a.finalFeePaid?'<span class="badge badge-green">Paid</span>':'<span class="badge badge-amber">Pending</span>'):'—'}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ===================== SDC ===================== */
function renderSDC(){ currentNav==='regno' ? renderSDCRegNo() : renderSDCMigrate(); }

function renderSDCRegNo(){
  const ready = state.applicants.filter(a=>a.finalFeePaid && !a.newReg);
  const done = state.applicants.filter(a=>a.newReg);
  document.getElementById('main').innerHTML = `
    <div class="page-head"><div><div class="eyebrow">SDC</div><h1>Registration Numbers &amp; Credentials</h1><p>Not automated — create the new VTOP username and password yourself, then record them here once the final fee is paid.</p></div></div>
    <div class="card">
      <h3>Awaiting Credentials</h3>
      ${ready.length===0?'<p style="color:var(--slate);">Nothing pending right now.</p>':ready.map(a=>`
        <div style="padding:14px 0;border-bottom:1px solid var(--line);">
          <div><strong>${a.name}</strong> <span class="num" style="color:var(--slate);">(${a.oldReg})</span> → ${prog(a.programme).name}</div>
          <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
            <input type="text" id="reg-${a.id}" placeholder="New Registration No. (username)" style="flex:1;min-width:200px;padding:10px 12px;border:1.5px solid var(--line);border-radius:10px;font-size:13px;">
            <input type="text" id="pwd-${a.id}" placeholder="New Password" style="flex:1;min-width:160px;padding:10px 12px;border:1.5px solid var(--line);border-radius:10px;font-size:13px;">
            <button class="btn btn-sky btn-sm" onclick="saveCredentials('${a.id}')">Save Credentials</button>
          </div>
        </div>`).join('')}
    </div>
    <div class="card" style="margin-top:16px;">
      <div class="flex-between"><h3>Issued</h3><button class="btn btn-outline btn-sm" onclick="showToast('registration_numbers.csv exported (simulated)')">⬇ Export</button></div>
      <table><thead><tr><th>Name</th><th>New Reg. No. (Username)</th><th>Password</th></tr></thead>
      <tbody>${done.map(a=>`<tr><td>${a.name}</td><td class="num">${a.newReg}</td><td class="num">${a.newPassword||'—'}</td></tr>`).join('')}
      ${done.length===0?'<tr><td colspan="3" style="color:var(--slate);">None yet.</td></tr>':''}</tbody></table>
    </div>
  `;
}
function saveCredentials(id){
  const regInput=document.getElementById('reg-'+id), pwdInput=document.getElementById('pwd-'+id);
  const reg=(regInput.value||'').trim(), pwd=(pwdInput.value||'').trim();
  if(!reg || !pwd){ showToast('Enter both Registration No. and Password before saving'); return; }
  const a=stu(id); a.newReg=reg; a.newPassword=pwd;
  renderSDCRegNo(); showToast('Credentials saved for '+a.name+' — sent to Assistant Director for email');
}

function renderSDCMigrate(){
  const ready = state.applicants.filter(a=>a.newEmail && !a.dataMigrated);
  const done = state.applicants.filter(a=>a.dataMigrated);
  document.getElementById('main').innerHTML = `
    <div class="page-head"><div><div class="eyebrow">SDC</div><h1>Data Migration — Old Login → New Login</h1><p>Final step. Once the new Registration No. and Email are issued, move courses, results, grading and all payment records from the student's old login to the new one.</p></div></div>
    <div class="card">
      <h3>Awaiting Data Migration</h3>
      ${ready.length===0?'<p style="color:var(--slate);">Nothing pending right now.</p>':ready.map(a=>`
        <div style="padding:15px 0;border-bottom:1px solid var(--line);">
          <div class="flex-between">
            <div><strong>${a.name}</strong><br><span class="num" style="color:var(--slate);font-size:12px;">${a.oldReg} → ${a.newReg} · ${a.newEmail}</span></div>
            ${checklistDone(a)?`<button class="btn btn-sky btn-sm" onclick="completeMigration('${a.id}')">Mark Fully Migrated ✓</button>`:'<span class="badge badge-amber">In Progress</span>'}
          </div>
          <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:8px;">
            ${CHECKLIST_ITEMS.map(item=>`
              <button class="btn btn-sm ${a.checklist[item.key]?'btn-sky':'btn-outline'}" onclick="toggleChecklist('${a.id}','${item.key}')">
                ${a.checklist[item.key]?'✓ ':''}${item.label}
              </button>`).join('')}
          </div>
        </div>`).join('')}
      <p class="hint">Click each item to mark it moved to the new login. "Mark Fully Migrated" unlocks once all four are done.</p>
    </div>
    <div class="card" style="margin-top:16px;">
      <div class="flex-between"><h3>Fully Migrated</h3><button class="btn btn-outline btn-sm" onclick="showToast('data_migration_log.csv exported (simulated)')">⬇ Export Log</button></div>
      <table><thead><tr><th>Name</th><th>Old Reg. No.</th><th>New Reg. No.</th><th>New Email</th></tr></thead>
      <tbody>${done.map(a=>`<tr><td>${a.name}</td><td class="num">${a.oldReg}</td><td class="num">${a.newReg}</td><td class="num">${a.newEmail}</td></tr>`).join('')}
      ${done.length===0?'<tr><td colspan="4" style="color:var(--slate);">None yet.</td></tr>':''}</tbody></table>
    </div>
  `;
}
function toggleChecklist(id,key){
  const a=stu(id); a.checklist[key]=!a.checklist[key];
  renderSDCMigrate();
}
function completeMigration(id){
  const a=stu(id); a.dataMigrated=true;
  renderSDCMigrate(); showToast('All records migrated — '+a.name+"'s account is fully switched to the new login");
}

/* ===================== ASSISTANT DIRECTOR (manual email entry) ===================== */
function renderAD(){
  const pending = state.applicants.filter(a=>a.newReg && !a.newEmail);
  const done = state.applicants.filter(a=>a.newEmail);
  document.getElementById('main').innerHTML = `
    <div class="page-head"><div><div class="eyebrow">Assistant Director</div><h1>Email Issuance</h1><p>Email generation is not automated — create the mailbox in your own email portal, then record it here.</p></div></div>
    <div class="card">
      <h3>Awaiting Email</h3>
      ${pending.length===0?'<p style="color:var(--slate);">Nothing pending right now.</p>':pending.map(a=>`
        <div style="padding:13px 0;border-bottom:1px solid var(--line);">
          <div class="flex-between">
            <div><strong>${a.name}</strong> <span class="num" style="color:var(--slate);">— ${a.newReg}</span></div>
          </div>
          <div style="margin-top:8px;display:flex;gap:8px;">
            <input type="text" id="email-${a.id}" placeholder="e.g. ${a.newReg.toLowerCase()}@university.edu.in" style="flex:1;padding:10px 12px;border:1.5px solid var(--line);border-radius:10px;font-size:13px;">
            <button class="btn btn-sky btn-sm" onclick="saveEmail('${a.id}')">Save &amp; Complete</button>
          </div>
        </div>`).join('')}
    </div>
    <div class="card" style="margin-top:16px;">
      <h3>Completed</h3>
      <table><thead><tr><th>Name</th><th>Reg. No.</th><th>Email</th></tr></thead>
      <tbody>${done.map(a=>`<tr><td>${a.name}</td><td class="num">${a.newReg}</td><td class="num">${a.newEmail}</td></tr>`).join('')}
      ${done.length===0?'<tr><td colspan="3" style="color:var(--slate);">None yet.</td></tr>':''}</tbody></table>
    </div>
  `;
}
function saveEmail(id){
  const input=document.getElementById('email-'+id);
  const val=(input.value||'').trim();
  if(!val){ showToast('Enter the email you created before saving'); return; }
  stu(id).newEmail=val;
  renderAD(); showToast('Email recorded — migration completed for '+stu(id).name);
}

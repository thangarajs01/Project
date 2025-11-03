const LS_KEY = 'employee_directory_v1';

const sample = [
  {id:1,name:'Aisha Patel',job:'Frontend Engineer',email:'aisha.patel@example.com',phone:'+91 98765 43210',department:'Engineering',location:'Bengaluru'},
  {id:2,name:'Rahul Kumar',job:'HR Manager',email:'rahul.kumar@example.com',phone:'+91 91234 56789',department:'HR',location:'Chennai'},
  {id:3,name:'Neha Sharma',job:'Sales Executive',email:'neha.sharma@example.com',phone:'+91 99876 54321',department:'Sales',location:'Mumbai'},
  {id:4,name:'Karthik R',job:'Product Designer',email:'karthik.r@example.com',phone:'+91 90123 45678',department:'Design',location:'Coimbatore'},
];

let employees = load();
let editingId = null;

// elements
const grid = document.getElementById('grid');
const search = document.getElementById('search');
const deptFilter = document.getElementById('departmentFilter');
const sortEl = document.getElementById('sort');
const addBtn = document.getElementById('addBtn');
const modal = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const cancel = document.getElementById('cancel');
const save = document.getElementById('save');
const exportCsv = document.getElementById('exportCsv');
const resetStorage = document.getElementById('resetStorage');

const inpName = document.getElementById('inpName');
const inpJob = document.getElementById('inpJob');
const inpEmail = document.getElementById('inpEmail');
const inpPhone = document.getElementById('inpPhone');
const inpDept = document.getElementById('inpDept');
const inpLocation = document.getElementById('inpLocation');

// init
render();
populateDepartmentFilter();

// events
search.addEventListener('input', render);
deptFilter.addEventListener('change', render);
sortEl.addEventListener('change', render);
addBtn.addEventListener('click', ()=>openModal());
cancel.addEventListener('click', closeModal);
save.addEventListener('click', onSave);
exportCsv.addEventListener('click', onExportCsv);
resetStorage.addEventListener('click', onReset);
modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

function load(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw){ localStorage.setItem(LS_KEY, JSON.stringify(sample)); return [...sample]; }
    return JSON.parse(raw);
  }catch(e){ localStorage.setItem(LS_KEY, JSON.stringify(sample)); return [...sample]; }
}

function saveToStorage(){ localStorage.setItem(LS_KEY, JSON.stringify(employees)); }

function render(){
  const q = search.value.trim().toLowerCase();
  const dept = deptFilter.value;
  const sortVal = sortEl.value;

  let list = employees.filter(emp=>{
    if(dept && emp.department !== dept) return false;
    if(!q) return true;
    return [emp.name,emp.job,emp.email,emp.phone,emp.location,emp.department].join(' ').toLowerCase().includes(q);
  });

  list.sort((a,b)=>{
    const [field,dir] = sortVal.split('-');
    const av = (a[field]||'').toLowerCase();
    const bv = (b[field]||'').toLowerCase();
    if(av < bv) return dir==='asc'?-1:1;
    if(av > bv) return dir==='asc'?1:-1;
    return 0;
  });

  grid.innerHTML = '';
  if(list.length===0){
    grid.innerHTML = '<div style="grid-column:1/-1;padding:24px;color:var(--muted);">No employees found.</div>';
    return;
  }

  for(const emp of list){
    const el = document.createElement('div');
    el.className='employee';
    el.innerHTML = `
      <div class="avatar">${initials(emp.name)}</div>
      <div class="info">
        <div class="name">${escapeHtml(emp.name)}</div>
        <div class="meta">${escapeHtml(emp.job)} • <span class="pill">${escapeHtml(emp.department)}</span></div>
        <div class="meta" style="margin-top:6px">${escapeHtml(emp.email)} · ${escapeHtml(emp.phone)} · ${escapeHtml(emp.location)}</div>
      </div>
      <div class="actions">
        <button class="ghost" data-id="${emp.id}" data-action="edit">Edit</button>
        <button class="ghost" data-id="${emp.id}" data-action="del">Delete</button>
      </div>
    `;
    el.querySelectorAll('button').forEach(btn=>btn.addEventListener('click', e=>{
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      if(action==='edit') openModal(id);
      if(action==='del') onDelete(id);
    }));
    el.addEventListener('click', ()=>openModal(emp.id));
    grid.appendChild(el);
  }
}

function populateDepartmentFilter(){
  const set = new Set(employees.map(e=>e.department).filter(Boolean));
  const cur = deptFilter.value;
  deptFilter.innerHTML = '<option value="">All departments</option>' +
    [...set].map(d=>`<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
  if([...set].includes(cur)) deptFilter.value = cur;
}

function openModal(id=null){
  editingId = id;
  if(id){
    const emp = employees.find(x=>x.id===id);
    if(emp){ 
      modalTitle.textContent = 'Edit Employee';
      inpName.value = emp.name;
      inpJob.value = emp.job;
      inpEmail.value = emp.email;
      inpPhone.value = emp.phone;
      inpDept.value = emp.department;
      inpLocation.value = emp.location;
    }
  } else {
    modalTitle.textContent = 'Add Employee';
    inpName.value=inpJob.value=inpEmail.value=inpPhone.value=inpLocation.value='';
    inpDept.value='Engineering';
  }
  modal.style.display='flex';
  setTimeout(()=>inpName.focus(),60);
}

function closeModal(){ modal.style.display='none'; editingId=null; }

function onSave(){
  const name = inpName.value.trim();
  if(!name){ alert('Please enter a name'); return; }
  const job = inpJob.value.trim();
  const email = inpEmail.value.trim();
  const phone = inpPhone.value.trim();
  const department = inpDept.value;
  const location = inpLocation.value.trim();

  if(editingId){
    const idx = employees.findIndex(e=>e.id===editingId);
    if(idx!==-1){ employees[idx] = {...employees[idx],name,job,email,phone,department,location}; }
  } else {
    const id = (employees.reduce((m,e)=>Math.max(m,e.id),0) || 0) + 1;
    employees.push({id,name,job,email,phone,department,location});
  }
  saveToStorage();
  populateDepartmentFilter();
  render();
  closeModal();
}

function onDelete(id){
  if(!confirm('Delete this employee?')) return;
  employees = employees.filter(e=>e.id!==id);
  saveToStorage();
  populateDepartmentFilter();
  render();
}

function onExportCsv(){
  const headers = ['id','name','job','email','phone','department','location'];
  const rows = [headers.join(',')].concat(employees.map(e=>headers.map(h=>csvSafe(e[h])).join(','))).join('\\n');
  const blob = new Blob([rows],{type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'employees.csv';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function onReset(){
  if(!confirm('Reset directory to sample data?')) return;
  localStorage.removeItem(LS_KEY);
  employees = load();
  populateDepartmentFilter();
  render();
}

function initials(name){ if(!name) return '?'; return name.split(' ').map(s=>s[0]||'').slice(0,2).join('').toUpperCase(); }
function escapeHtml(s){ if(s==null) return ''; return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\"','&quot;').replaceAll(\"'\",\"&#39;\"); }
function csvSafe(v){ if(v==null) return ''; const s = String(v).replaceAll('\"','\"\"'); if(s.includes(',')||s.includes('\\n')) return '\"'+s+'\"'; return s; }

function buildNav(activePage) {
  const depth = getDepth(activePage);
  const r = depth === 0 ? '' : depth === 1 ? '../' : '../../';

  const nav = [
    { label: null, links: [
      { href: 'index.html', text: '⌂  Home', id: 'home' },
    ]},
    { label: 'SOPs', links: [
      { href: 'sops/index.html', text: 'SOP Index', id: 'sop-index' },
      { href: 'sops/cip-processing-tanks.html', text: '↳ CIP – Processing Tanks', id: 'sop-cip', sub: true },
      { href: 'sops/barrel-disgorging.html', text: '↳ Barrel Disgorging', id: 'sop-disgorge', sub: true },
      { href: 'sops/bottle-filling.html', text: '↳ Bottling Line', id: 'sop-bottling', sub: true },
      { href: 'sops/proofing.html', text: '↳ Proofing Operations', id: 'sop-proof', sub: true },
    ]},
    { label: 'Equipment', links: [
      { href: 'equipment/index.html', text: 'Equipment Index', id: 'eq-index' },
      { href: 'equipment/vessels/processing-tank.html', text: '↳ Processing Tank', id: 'eq-pt', sub: true },
      { href: 'equipment/vessels/ibc-tote.html', text: '↳ IBC Tote', id: 'eq-ibc', sub: true },
      { href: 'equipment/utilities/compressed-air.html', text: '↳ Compressed Air', id: 'eq-air', sub: true },
      { href: 'equipment/utilities/ro-water.html', text: '↳ RO Water System', id: 'eq-ro', sub: true },
      { href: 'equipment/utilities/hot-water.html', text: '↳ Hot Water', id: 'eq-hw', sub: true },
      { href: 'equipment/utilities/city-water.html', text: '↳ City Water', id: 'eq-cw', sub: true },
      { href: 'equipment/utilities/hvac.html', text: '↳ HVAC & Exhaust', id: 'eq-hvac', sub: true },
      { href: 'equipment/utilities/generator.html', text: '↳ Generator', id: 'eq-gen', sub: true },
      { href: 'equipment/material-handling/forklift.html', text: '↳ Forklift', id: 'eq-fl', sub: true },
      { href: 'equipment/material-handling/pallet-jack.html', text: '↳ Pallet Jack', id: 'eq-pj', sub: true },
      { href: 'equipment/lab-bottling/alcohol-meter.html', text: '↳ Alcohol Meter', id: 'eq-am', sub: true },
      { href: 'equipment/lab-bottling/bottle-filler.html', text: '↳ Bottle Filler', id: 'eq-bf', sub: true },
    ]},
    { label: 'Chemicals & SDS', links: [
      { href: 'chemicals/index.html', text: 'Chemical Index', id: 'chem-index' },
      { href: 'chemicals/alkaline-detergent.html', text: '↳ Alkaline Detergent', id: 'chem-det', sub: true },
      { href: 'chemicals/citric-acid.html', text: '↳ Citric Acid', id: 'chem-acid', sub: true },
      { href: 'chemicals/sanitizer.html', text: '↳ No-Rinse Sanitizer', id: 'chem-san', sub: true },
    ]},
    { label: 'Vendors', links: [
      { href: 'vendors/index.html', text: 'Vendor Index', id: 'vend-index' },
      { href: 'vendors/chemical-supplier.html', text: '↳ Chemical Supplier', id: 'vend-chem', sub: true },
      { href: 'vendors/equipment-fabricator.html', text: '↳ Equipment Fabricator', id: 'vend-fab', sub: true },
      { href: 'vendors/maintenance-service.html', text: '↳ Maintenance & Service', id: 'vend-maint', sub: true },
      { href: 'vendors/forklift-service.html', text: '↳ Forklift Service', id: 'vend-fl', sub: true },
    ]},
    { label: 'Tools & Concepts', links: [
      { href: 'tools/index.html', text: 'Tools Index', id: 'tools-index' },
      { href: 'tools/chemical-dilution.html', text: '↳ Dilution Calculator', id: 'tools-dil', sub: true },
      { href: 'tools/proofing-concepts.html', text: '↳ Proofing Concepts', id: 'tools-proof', sub: true },
    ]},
    { label: 'Administrative', links: [
      { href: 'administrative/index.html', text: 'Administrative', id: 'admin-index' },
      { href: 'administrative/product-receiving.html', text: '↳ Product Receiving', id: 'admin-recv', sub: true },
    ]},
  ];

  let html = '';
  for (const section of nav) {
    html += '<div class="nav-section">';
    if (section.label) html += `<div class="nav-section-label">${section.label}</div>`;
    for (const link of section.links) {
      const isActive = activePage === link.id ? ' active' : '';
      const cls = link.sub ? `nav-sub${isActive}` : `nav-link${isActive}`;
      html += `<a href="${r}${link.href}" class="${cls}">${link.text}</a>`;
    }
    html += '</div>';
  }
  return html;
}

function getDepth(page) {
  // depth 0 = root (home)
  if (page === 'home') return 0;
  // depth 1 = one directory deep (sop-index, eq-index, chem-index, etc.)
  const depth1 = ['sop-index','eq-index','chem-index','vend-index','tools-index','admin-index'];
  if (depth1.includes(page)) return 1;
  // depth 2 = two directories deep (all individual item pages)
  return 2;
}

function initNav(activePage) {
  document.getElementById('sidebar-nav').innerHTML = buildNav(activePage);
}

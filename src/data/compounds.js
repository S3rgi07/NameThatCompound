// src/data/compounds.js

export const CATEGORIES = {
  OX_MET: "Óxidos Metálicos",
  OX_NO_MET: "Óxidos No Metálicos",
  HIDROX: "Hidróxidos",
  ACID_HIDR: "Ácidos Hidrácidos",
  OXACID: "Oxácidos",
  SAL_BIN: "Sales Binarias",
  SAL_TER: "Sales Ternarias"
};

const rawCompounds = [
  // --- ÓXIDOS METÁLICOS (Base + Nuevos) ---
  { f: "Na2O", a: ["Oxido de sodio", "Oxido sodico"], t: "OX_MET" },
  { f: "K2O", a: ["Oxido de potasio", "Oxido potasico"], t: "OX_MET" },
  { f: "CaO", a: ["Oxido de calcio", "Oxido calcico"], t: "OX_MET" },
  { f: "FeO", a: ["Oxido ferroso", "Oxido de hierro (II)"], t: "OX_MET" },
  { f: "Fe2O3", a: ["Oxido ferrico", "Oxido de hierro (III)"], t: "OX_MET" },
  { f: "CuO", a: ["Oxido cuprico", "Oxido de cobre (II)"], t: "OX_MET" },
  { f: "Cu2O", a: ["Oxido cuproso", "Oxido de cobre (I)"], t: "OX_MET" },
  { f: "ZnO", a: ["Oxido de zinc"], t: "OX_MET" },
  { f: "Al2O3", a: ["Oxido de aluminio"], t: "OX_MET" },
  { f: "Au2O3", a: ["Oxido aurico", "Oxido de oro (III)"], t: "OX_MET" },
  { f: "HgO", a: ["Oxido mercurico", "Oxido de mercurio (II)"], t: "OX_MET" },
  { f: "Hg2O", a: ["Oxido mercuroso", "Oxido de mercurio (I)"], t: "OX_MET" },
  { f: "PbO2", a: ["Oxido plumbico", "Oxido de plomo (IV)"], t: "OX_MET" },
  { f: "PbO", a: ["Oxido plumboso", "Oxido de plomo (II)"], t: "OX_MET" },
  { f: "SnO2", a: ["Oxido estannico", "Oxido de estaño (IV)"], t: "OX_MET" },
  { f: "MgO", a: ["Oxido de magnesio"], t: "OX_MET" },
  { f: "Ag2O", a: ["Oxido de plata"], t: "OX_MET" },
  { f: "NiO", a: ["Oxido niqueloso", "Oxido de niquel (II)"], t: "OX_MET" },
  { f: "Ni2O3", a: ["Oxido niquelico", "Oxido de niquel (III)"], t: "OX_MET" },
  { f: "CoO", a: ["Oxido cobaltoso", "Oxido de cobalto (II)"], t: "OX_MET" },

  // --- ÓXIDOS NO METÁLICOS (Base + Nuevos) ---
  { f: "CO2", a: ["Dioxido de carbono", "Anhidrido carbonico"], t: "OX_NO_MET" },
  { f: "CO", a: ["Monoxido de carbono", "Anhidrido carbonoso"], t: "OX_NO_MET" },
  { f: "SO2", a: ["Dioxido de azufre", "Anhidrido sulfuroso"], t: "OX_NO_MET" },
  { f: "SO3", a: ["Trioxido de azufre", "Anhidrido sulfurico"], t: "OX_NO_MET" },
  { f: "N2O5", a: ["Anhidrido nitrico", "Oxido de nitrogeno (V)"], t: "OX_NO_MET" },
  { f: "Cl2O7", a: ["Anhidrido perclorico", "Heptaoxido de dicloro"], t: "OX_NO_MET" },
  { f: "Cl2O", a: ["Anhidrido hipocloroso", "Monoxido de dicloro"], t: "OX_NO_MET" },
  { f: "Cl2O3", a: ["Anhidrido cloroso", "Trioxido de dicloro"], t: "OX_NO_MET" },
  { f: "P2O3", a: ["Anhidrido fosforoso", "Trioxido de difosforo"], t: "OX_NO_MET" },
  { f: "P2O5", a: ["Anhidrido fosforico", "Pentaoxido de difosforo"], t: "OX_NO_MET" },
  { f: "Br2O", a: ["Anhidrido hipobromoso", "Monoxido de dibromo"], t: "OX_NO_MET" },
  { f: "Br2O5", a: ["Anhidrido bromico", "Pentaoxido de dibromo"], t: "OX_NO_MET" },
  { f: "I2O7", a: ["Anhidrido periodico", "Heptaoxido de diyodo"], t: "OX_NO_MET" },
  { f: "SiO2", a: ["Dioxido de silicio", "Silice"], t: "OX_NO_MET" },
  { f: "B2O3", a: ["Anhidrido borico", "Oxido de boro"], t: "OX_NO_MET" },

  // --- HIDRÓXIDOS (Base + Nuevos) ---
  { f: "NaOH", a: ["Hidroxido de sodio"], t: "HIDROX" },
  { f: "Mg(OH)2", a: ["Hidroxido de magnesio"], t: "HIDROX" },
  { f: "Al(OH)3", a: ["Hidroxido de aluminio"], t: "HIDROX" },
  { f: "Fe(OH)3", a: ["Hidroxido ferrico", "Hidroxido de hierro (III)"], t: "HIDROX" },
  { f: "Fe(OH)2", a: ["Hidroxido ferroso", "Hidroxido de hierro (II)"], t: "HIDROX" },
  { f: "KOH", a: ["Hidroxido de potasio"], t: "HIDROX" },
  { f: "LiOH", a: ["Hidroxido de litio"], t: "HIDROX" },
  { f: "Ba(OH)2", a: ["Hidroxido de bario"], t: "HIDROX" },
  { f: "Zn(OH)2", a: ["Hidroxido de zinc"], t: "HIDROX" },
  { f: "Pb(OH)4", a: ["Hidroxido plumbico", "Hidroxido de plomo (IV)"], t: "HIDROX" },
  { f: "Cu(OH)2", a: ["Hidroxido cuprico", "Hidroxido de cobre (II)"], t: "HIDROX" },
  { f: "NH4OH", a: ["Hidroxido de amonio"], t: "HIDROX" },
  { f: "Ca(OH)2", a: ["Hidroxido de calcio"], t: "HIDROX" },
  { f: "Sn(OH)2", a: ["Hidroxido estannoso"], t: "HIDROX" },
  { f: "Co(OH)3", a: ["Hidroxido cobaltico"], t: "HIDROX" },

  // --- ÁCIDOS HIDRÁCIDOS (Base + Nuevos) ---
  { f: "HCl", a: ["Acido clorhidrico", "Cloruro de hidrogeno"], t: "ACID_HIDR" },
  { f: "H2S", a: ["Acido sulfhidrico", "Sulfuro de hidrogeno"], t: "ACID_HIDR" },
  { f: "HF", a: ["Acido fluorhidrico", "Fluoruro de hidrogeno"], t: "ACID_HIDR" },
  { f: "HBr", a: ["Acido bromhidrico", "Bromuro de hidrogeno"], t: "ACID_HIDR" },
  { f: "HI", a: ["Acido yodhidrico", "Yoduro de hidrogeno"], t: "ACID_HIDR" },
  { f: "H2Se", a: ["Acido selenhidrico", "Seleniuro de hidrogeno"], t: "ACID_HIDR" },
  { f: "H2Te", a: ["Acido telurhidrico", "Telururo de hidrogeno"], t: "ACID_HIDR" },

  // --- OXÁCIDOS (Base + Nuevos) ---
  { f: "H2SO4", a: ["Acido sulfurico"], t: "OXACID" },
  { f: "HNO3", a: ["Acido nitrico"], t: "OXACID" },
  { f: "H3PO4", a: ["Acido fosforico", "Acido ortofosforico"], t: "OXACID" },
  { f: "H2CO3", a: ["Acido carbonico"], t: "OXACID" },
  { f: "HClO4", a: ["Acido perclorico"], t: "OXACID" },
  { f: "HClO", a: ["Acido hipocloroso"], t: "OXACID" },
  { f: "HClO2", a: ["Acido cloroso"], t: "OXACID" },
  { f: "HClO3", a: ["Acido clorico"], t: "OXACID" },
  { f: "H2SO3", a: ["Acido sulfuroso"], t: "OXACID" },
  { f: "HNO2", a: ["Acido nitroso"], t: "OXACID" },
  { f: "HBrO3", a: ["Acido bromico"], t: "OXACID" },
  { f: "HIO3", a: ["Acido yodico"], t: "OXACID" },
  { f: "HMnO4", a: ["Acido permanganico"], t: "OXACID" },
  { f: "H2CrO4", a: ["Acido cromico"], t: "OXACID" },
  { f: "H3BO3", a: ["Acido borico"], t: "OXACID" },
  { f: "H4P2O7", a: ["Acido pirofosforico"], t: "OXACID" },

  // --- SALES BINARIAS (Base + Nuevos) ---
  { f: "NaCl", a: ["Cloruro de sodio"], t: "SAL_BIN" },
  { f: "KI", a: ["Yoduro de potasio"], t: "SAL_BIN" },
  { f: "FeCl3", a: ["Cloruro ferrico"], t: "SAL_BIN" },
  { f: "FeCl2", a: ["Cloruro ferroso"], t: "SAL_BIN" },
  { f: "CaS", a: ["Sulfuro de calcio"], t: "SAL_BIN" },
  { f: "AgCl", a: ["Cloruro de plata"], t: "SAL_BIN" },
  { f: "PbI2", a: ["Yoduro de plomo (II)", "Yoduro plumboso"], t: "SAL_BIN" },
  { f: "CuBr2", a: ["Bromuro cuprico"], t: "SAL_BIN" },
  { f: "MgF2", a: ["Fluoruro de magnesio"], t: "SAL_BIN" },
  { f: "AlCl3", a: ["Cloruro de aluminio"], t: "SAL_BIN" },
  { f: "ZnS", a: ["Sulfuro de zinc"], t: "SAL_BIN" },
  { f: "CaCl2", a: ["Cloruro de calcio"], t: "SAL_BIN" },
  { f: "KBr", a: ["Bromuro de potasio"], t: "SAL_BIN" },
  { f: "LiF", a: ["Fluoruro de litio"], t: "SAL_BIN" },
  { f: "SnCl4", a: ["Cloruro estannico"], t: "SAL_BIN" },

  // --- SALES TERNARIAS (Base + Nuevos) ---
  { f: "CaCO3", a: ["Carbonato de calcio"], t: "SAL_TER" },
  { f: "NaNO3", a: ["Nitrato de sodio"], t: "SAL_TER" },
  { f: "K2SO4", a: ["Sulfato de potasio"], t: "SAL_TER" },
  { f: "CuSO4", a: ["Sulfato cuprico"], t: "SAL_TER" },
  { f: "KMnO4", a: ["Permanganato de potasio"], t: "SAL_TER" },
  { f: "NaClO", a: ["Hipoclorito de sodio"], t: "SAL_TER" },
  { f: "KClO3", a: ["Clorato de potasio"], t: "SAL_TER" },
  { f: "FeSO4", a: ["Sulfato ferroso"], t: "SAL_TER" },
  { f: "AgNO3", a: ["Nitrato de plata"], t: "SAL_TER" },
  { f: "BaSO4", a: ["Sulfato de bario"], t: "SAL_TER" },
  { f: "Li2CO3", a: ["Carbonato de litio"], t: "SAL_TER" },
  { f: "AlPO4", a: ["Fosfato de aluminio"], t: "SAL_TER" },
  { f: "Ca3(PO4)2", a: ["Fosfato de calcio"], t: "SAL_TER" },
  { f: "Na2SO3", a: ["Sulfito de sodio"], t: "SAL_TER" },
  { f: "KNO2", a: ["Nitrito de potasio"], t: "SAL_TER" },
  { f: "Cu(NO3)2", a: ["Nitrato cuprico"], t: "SAL_TER" },
  { f: "MgCO3", a: ["Carbonato de magnesio"], t: "SAL_TER" },
  { f: "NaHCO3", a: ["Bicarbonato de sodio", "Carbonato acido de sodio"], t: "SAL_TER" }
];

export const normalizeText = (text) => {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
};

export const getRandomCompound = (activeFilters) => {
  // Asegurar que activeFilters sea un array válido, si no, usar todas
  const filters = (activeFilters && activeFilters.length > 0) ? activeFilters : Object.keys(CATEGORIES);
  const filtered = rawCompounds.filter(c => filters.includes(c.t));
  
  if (filtered.length === 0) return rawCompounds[0]; 
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return {
    formula: filtered[randomIndex].f,
    answers: filtered[randomIndex].a,
    type: CATEGORIES[filtered[randomIndex].t]
  };
};

export const compoundsCount = rawCompounds.length;
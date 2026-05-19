import * as sys from './sys.js';
const qn=sys.List.make(sys.Str.type$,[]);
let q;
// dimensionless
qn.add('dimensionless');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('percent, %; ; 0.01'));
q.add(sys.Unit.define('percent_relative_humidity, %RH; ; 0.01'));
q.add(sys.Unit.define('pixel, px'));
q.add(sys.Unit.define('decibel, db'));
q.add(sys.Unit.define('power_factor, pf'));
q.add(sys.Unit.define('ph, pH'));
q.add(sys.Unit.define('grams_of_water_per_kilogram_dry_air, gH₂O/kgAir'));
q.add(sys.Unit.define('volts_per_degree_kelvin, V/K'));
q.add(sys.Unit.define('degree_days_celsius, °daysC'));
q.add(sys.Unit.define('degree_days_fahrenheit, °daysF'));
q.add(sys.Unit.define('percent_obscuration_per_foot, %obsc/ft'));
q.add(sys.Unit.define('percent_obscuration_per_meter, %obsc/m'));
q.add(sys.Unit.define('psi_per_degree_fahrenheit, psi/°F'));
q.add(sys.Unit.define('square_meters_per_newton, m²/N'));
q.add(sys.Unit.define('watts_per_square_meter_degree_kelvin, W/m²K'));
q.add(sys.Unit.define('db_millivolt, dBmV'));
q.add(sys.Unit.define('db_microvolt, dBµV'));
q.add(sys.Unit.define('parts_per_unit, ppu'));
q.add(sys.Unit.define('parts_per_million, ppm; ; 1.0E-6'));
q.add(sys.Unit.define('parts_per_billion, ppb; ; 1.0E-9'));
q.add(sys.Unit.define('grams_per_kilogram, g/kg; ; 0.0010'));
q.add(sys.Unit.define('radian, rad'));
q.add(sys.Unit.define('degrees_angular, deg; ; 0.017453292519943'));
q.add(sys.Unit.define('degrees_phase, degPh; ; 0.017453292519943'));
q.add(sys.Unit.define('steradian, sr'));
q.add(sys.Unit.define('nephelometric_turbidity_units, ntu'));
q.add(sys.Unit.define('formazin_nephelometric_unit, fnu'));
q.add(sys.Unit.define('power_usage_effectiveness, PUE'));
q.add(sys.Unit.define('data_center_infrastructure_efficiency, DCIE'));
sys.Unit.__quantityUnits('dimensionless', q);

// currency
qn.add('currency');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('afghani,AFN,Af'));
q.add(sys.Unit.define('algerian_dinar,DZD'));
q.add(sys.Unit.define('argentine_peso,ARS'));
q.add(sys.Unit.define('armenian_dram,AMD,Դ'));
q.add(sys.Unit.define('aruban_guilder_florin,AWG,ƒ'));
q.add(sys.Unit.define('australian_dollar,AUD'));
q.add(sys.Unit.define('azerbaijanian_manat,AZN,ман'));
q.add(sys.Unit.define('bahamian_dollar,BSD'));
q.add(sys.Unit.define('bahraini_dinar,BHD'));
q.add(sys.Unit.define('baht,THB,฿'));
q.add(sys.Unit.define('balboa,PAB'));
q.add(sys.Unit.define('barbados_dollar,BBD'));
q.add(sys.Unit.define('belarussian_ruble,BYR,Br'));
q.add(sys.Unit.define('belize_dollar,BZD'));
q.add(sys.Unit.define('bermudian_dollar,BMD'));
q.add(sys.Unit.define('bolivar_fuerte,VEF'));
q.add(sys.Unit.define('boliviano,BOB'));
q.add(sys.Unit.define('brazilian_real,BRL,R$'));
q.add(sys.Unit.define('brunei_dollar,BND'));
q.add(sys.Unit.define('bulgarian_lev,BGN,лв'));
q.add(sys.Unit.define('burundi_franc,BIF'));
q.add(sys.Unit.define('canadian_dollar,CAD'));
q.add(sys.Unit.define('cape_verde_escudo,CVE'));
q.add(sys.Unit.define('cayman_islands_dollar,KYD'));
q.add(sys.Unit.define('cedi,GHS,₵'));
q.add(sys.Unit.define('cfa_franc_bceao,XAF'));
q.add(sys.Unit.define('cfp_franc,XPF'));
q.add(sys.Unit.define('chilean_peso,CLP'));
q.add(sys.Unit.define('chinese_yuan,CNY, 元'));
q.add(sys.Unit.define('congolese_franc,CDF'));
q.add(sys.Unit.define('cordoba_oro,NIO,C$'));
q.add(sys.Unit.define('costa_rican_colon,CRC,₡'));
q.add(sys.Unit.define('croatian_kuna,HRK,Kn'));
q.add(sys.Unit.define('cuban_peso,CUP'));
q.add(sys.Unit.define('czech_koruna,CZK,Kč'));
q.add(sys.Unit.define('dalasi,GMD'));
q.add(sys.Unit.define('danish_krone,DKK,kr'));
q.add(sys.Unit.define('denar,MKD,ден'));
q.add(sys.Unit.define('djibouti_franc,DJF'));
q.add(sys.Unit.define('dobra,STD,Db'));
q.add(sys.Unit.define('dominican_peso,DOP'));
q.add(sys.Unit.define('dong,VND,₫'));
q.add(sys.Unit.define('east_caribbean_dollar,XCD'));
q.add(sys.Unit.define('egyptian_pound,EGP'));
q.add(sys.Unit.define('ethiopian_birr,ETB'));
q.add(sys.Unit.define('euro,EUR,€'));
q.add(sys.Unit.define('falkland_islands_pound,FKP'));
q.add(sys.Unit.define('fiji_dollar,FJD'));
q.add(sys.Unit.define('forint,HUF'));
q.add(sys.Unit.define('gibraltar_pound,GIP'));
q.add(sys.Unit.define('gourde,HTG'));
q.add(sys.Unit.define('guarani,PYG,₲'));
q.add(sys.Unit.define('guinea_franc,GNF'));
q.add(sys.Unit.define('guyana_dollar,GYD'));
q.add(sys.Unit.define('hong_kong_dollar,HKD'));
q.add(sys.Unit.define('hryvnia,UAH,₴'));
q.add(sys.Unit.define('iceland_krona,ISK,Kr'));
q.add(sys.Unit.define('indian_rupee,INR,₹'));
q.add(sys.Unit.define('iranian_rial,IRR'));
q.add(sys.Unit.define('iraqi_dinar,IQD'));
q.add(sys.Unit.define('jamaican_dollar,JMD'));
q.add(sys.Unit.define('jordanian_dinar,JOD'));
q.add(sys.Unit.define('kenyan_shilling,KES,Sh'));
q.add(sys.Unit.define('kina,PGK'));
q.add(sys.Unit.define('kip,LAK,₭'));
q.add(sys.Unit.define('konvertibilna_marka,BAM,КМ'));
q.add(sys.Unit.define('kuwaiti_dinar,KWD'));
q.add(sys.Unit.define('kwacha,MWK,MK'));
q.add(sys.Unit.define('kwanza,AOA,Kz'));
q.add(sys.Unit.define('kyat,MMK'));
q.add(sys.Unit.define('lari,GEL,ლ'));
q.add(sys.Unit.define('lebanese_pound,LBP'));
q.add(sys.Unit.define('lek,ALL'));
q.add(sys.Unit.define('lempira,HNL'));
q.add(sys.Unit.define('leone,SLL,Le'));
q.add(sys.Unit.define('leu,RON'));
q.add(sys.Unit.define('liberian_dollar,LRD'));
q.add(sys.Unit.define('libyan_dinar,LYD'));
q.add(sys.Unit.define('lilangeni,SZL'));
q.add(sys.Unit.define('loti,LSL'));
q.add(sys.Unit.define('malagasy_ariary,MGA'));
q.add(sys.Unit.define('malaysian_ringgit,MYR,RM'));
q.add(sys.Unit.define('manat,TMT'));
q.add(sys.Unit.define('mauritius_rupee,MUR'));
q.add(sys.Unit.define('metical,MZN,MTn'));
q.add(sys.Unit.define('mexican_peso,MXN'));
q.add(sys.Unit.define('moldavian_leu,MDL'));
q.add(sys.Unit.define('moroccan_dirham,MAD'));
q.add(sys.Unit.define('naira,NGN,₦'));
q.add(sys.Unit.define('nakfa,ERN,Nfk'));
q.add(sys.Unit.define('namibia_dollar,NAD'));
q.add(sys.Unit.define('nepalese_rupee,NPR'));
q.add(sys.Unit.define('new_israeli_shekel,ILS,₪'));
q.add(sys.Unit.define('new_zealand_dollar,NZD'));
q.add(sys.Unit.define('ngultrum,BTN'));
q.add(sys.Unit.define('north_korean_won,KPW'));
q.add(sys.Unit.define('norwegian_krone,NOK'));
q.add(sys.Unit.define('nuevo_sol,PEN'));
q.add(sys.Unit.define('ouguiya,MRO,UM'));
q.add(sys.Unit.define('pakistan_rupee,PKR,₨'));
q.add(sys.Unit.define('pataca,MOP'));
q.add(sys.Unit.define('peso_uruguayo,UYU'));
q.add(sys.Unit.define('philippine_peso,PHP,₱'));
q.add(sys.Unit.define('pound_sterling,GBP,£'));
q.add(sys.Unit.define('pula,BWP'));
q.add(sys.Unit.define('pzloty,PLN,zł'));
q.add(sys.Unit.define('qatari_rial,QAR'));
q.add(sys.Unit.define('quetzal,GTQ'));
q.add(sys.Unit.define('rand,ZAR'));
q.add(sys.Unit.define('rial_omani,OMR'));
q.add(sys.Unit.define('riel,KHR'));
q.add(sys.Unit.define('rufiyaa,MVR'));
q.add(sys.Unit.define('rupiah,IDR,Rp'));
q.add(sys.Unit.define('russian_ruble,RUB'));
q.add(sys.Unit.define('rwanda_franc,RWF'));
q.add(sys.Unit.define('saint_helena_pound,SHP'));
q.add(sys.Unit.define('saudi_riyal,SAR'));
q.add(sys.Unit.define('serbian_dinar,RSD,din'));
q.add(sys.Unit.define('seychelles_rupee,SCR'));
q.add(sys.Unit.define('singapore_dollar,SGD'));
q.add(sys.Unit.define('solomon_islands_dollar,SBD'));
q.add(sys.Unit.define('som,KGS'));
q.add(sys.Unit.define('somali_shilling,SOS'));
q.add(sys.Unit.define('somoni,TJS,ЅМ'));
q.add(sys.Unit.define('south_korean_won,KRW,₩'));
q.add(sys.Unit.define('sri_lanka_rupee,LKR,Rs'));
q.add(sys.Unit.define('sudanese_pound,SDG'));
q.add(sys.Unit.define('suriname_dollar,SRD'));
q.add(sys.Unit.define('swedish_krona,SEK'));
q.add(sys.Unit.define('swiss_franc,CHF,SFr'));
q.add(sys.Unit.define('syrian_pound,SYP'));
q.add(sys.Unit.define('taiwan_dollar,TWD'));
q.add(sys.Unit.define('taka,BDT,৳'));
q.add(sys.Unit.define('tala,WST'));
q.add(sys.Unit.define('tanzanian_shilling,TZS'));
q.add(sys.Unit.define('tenge,KZT,〒'));
q.add(sys.Unit.define('trinidad_and_tobago_dollar,TTD'));
q.add(sys.Unit.define('tugrik,MNT,₮'));
q.add(sys.Unit.define('tunisian_dinar,TND'));
q.add(sys.Unit.define('turkish_lira,TRY,₤'));
q.add(sys.Unit.define('uae_dirham,AED'));
q.add(sys.Unit.define('uganda_shilling,UGX'));
q.add(sys.Unit.define('us_dollar,USD,$'));
q.add(sys.Unit.define('uzbekistan_sum,UZS'));
q.add(sys.Unit.define('vatu,VUV,Vt'));
q.add(sys.Unit.define('yemeni_rial,YER'));
q.add(sys.Unit.define('yen,JPY,¥'));
q.add(sys.Unit.define('zambian_kwacha,ZMW,ZK'));
q.add(sys.Unit.define('zimbabwe_dollar,ZWL'));
sys.Unit.__quantityUnits('currency', q);

// acceleration
qn.add('acceleration');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('meters_per_second_squared, m/s²; m1*sec-2'));
sys.Unit.__quantityUnits('acceleration', q);

// angular acceleration
qn.add('angular acceleration');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('radians_per_second_squared, rad/s²; sec-2'));
sys.Unit.__quantityUnits('angular acceleration', q);

// angular momentum
qn.add('angular momentum');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('joule_second, Js; kg1*m2*sec-1'));
sys.Unit.__quantityUnits('angular momentum', q);

// angular velocity
qn.add('angular velocity');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('radians_per_second, rad/s; sec-1'));
q.add(sys.Unit.define('revolutions_per_minute, rpm; sec-1; 6.2831853071796'));
sys.Unit.__quantityUnits('angular velocity', q);

// area
qn.add('area');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('square_meter, m²; m2'));
q.add(sys.Unit.define('square_millimeter, mm²; m2; 1.0E-6'));
q.add(sys.Unit.define('square_centimeter, cm²; m2; 1.0E-4'));
q.add(sys.Unit.define('square_kilometer, km²; m2; 1000000.0'));
q.add(sys.Unit.define('square_inch, in²; m2; 6.45161E-4'));
q.add(sys.Unit.define('square_foot, ft²; m2; 0.092903'));
q.add(sys.Unit.define('square_yard, yd²; m2; 0.836131'));
q.add(sys.Unit.define('square_mile, mile²; m2; 2589988.110336'));
q.add(sys.Unit.define('acre; m2; 4046.872627'));
sys.Unit.__quantityUnits('area', q);

// capacitance
qn.add('capacitance');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('farad, F; kg-1*m-2*sec4*A2'));
sys.Unit.__quantityUnits('capacitance', q);

// cooling efficiency
qn.add('cooling efficiency');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('coefficient_of_performance, COP; ; 1'));
q.add(sys.Unit.define('energy_efficiency_ratio, Btu/Wh, EER; ; 0.2930832356'));
q.add(sys.Unit.define('kilowatt_per_ton, kW/ton; ; 1'));
sys.Unit.__quantityUnits('cooling efficiency', q);

// density
qn.add('density');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('kilograms_per_cubic_meter, kg/m³; kg1*m-3'));
q.add(sys.Unit.define('grams_per_cubic_meter, g/m³; kg1*m-3; 1.0E-3'));
q.add(sys.Unit.define('milligrams_per_cubic_meter, mg/m³; kg1*m-3; 1.0E-6'));
q.add(sys.Unit.define('micrograms_per_cubic_meter, µg/m³; kg1*m-3; 1.0E-9'));
q.add(sys.Unit.define('kilograms_per_liter, kg/L; kg1*m-3; 1.0E-3'));
q.add(sys.Unit.define('milligrams_per_liter, mg/L; kg1*m-3; 1.0E-9'));
sys.Unit.__quantityUnits('density', q);

// electric charge
qn.add('electric charge');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('coulomb, C; sec1*A1'));
q.add(sys.Unit.define('ampere_hour, Ah; sec1*A1; 3600'));
sys.Unit.__quantityUnits('electric charge', q);

// electric conductance
qn.add('electric conductance');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('siemens, S; kg-1*m-2*sec3*A2'));
sys.Unit.__quantityUnits('electric conductance', q);

// electric current
qn.add('electric current');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('ampere, A; A1'));
q.add(sys.Unit.define('milliampere, mA; A1; 0.0010'));
sys.Unit.__quantityUnits('electric current', q);

// electromagnetic moment
qn.add('electromagnetic moment');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('ampere_square_meter, Am²; m2*A1'));
sys.Unit.__quantityUnits('electromagnetic moment', q);

// electric current density
qn.add('electric current density');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('amperes_per_square_meter, A/m²; m-2*A1'));
sys.Unit.__quantityUnits('electric current density', q);

// electric field strength
qn.add('electric field strength');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('volts_per_meter, V/m; kg1*m1*sec-3*A-1'));
sys.Unit.__quantityUnits('electric field strength', q);

// electric potential
qn.add('electric potential');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('volt, Volt, V; kg1*m2*sec-3*A-1'));
q.add(sys.Unit.define('millivolt, mV; kg1*m2*sec-3*A-1; 0.0010'));
q.add(sys.Unit.define('kilovolt, kV; kg1*m2*sec-3*A-1; 1000.0'));
q.add(sys.Unit.define('megavolt, MV; kg1*m2*sec-3*A-1; 1000000.0'));
sys.Unit.__quantityUnits('electric potential', q);

// electric resistance
qn.add('electric resistance');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('ohm, Ω, Ω; kg1*m2*sec-3*A-2'));
q.add(sys.Unit.define('kilohm, kΩ, kΩ; kg1*m2*sec-3*A-2; 1000.0'));
q.add(sys.Unit.define('megohm, MΩ, MΩ; kg1*m2*sec-3*A-2; 1000000.0'));
q.add(sys.Unit.define('milliohm, mΩ, mΩ; kg1*m2*sec-3*A-2; 0.0010'));
sys.Unit.__quantityUnits('electric resistance', q);

// electrical conductivity
qn.add('electrical conductivity');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('siemens_per_meter, S/m; kg-1*m-3*sec3*A2'));
sys.Unit.__quantityUnits('electrical conductivity', q);

// electrical resistivity
qn.add('electrical resistivity');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('ohm_meter, Ωm, Ωm; kg1*m3*sec-3*A-2'));
sys.Unit.__quantityUnits('electrical resistivity', q);

// energy
qn.add('energy');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('joule, J; kg1*m2*sec-2'));
q.add(sys.Unit.define('kilojoule, kJ; kg1*m2*sec-2; 1000.0'));
q.add(sys.Unit.define('watt_hour, Wh; kg1*m2*sec-2; 3600.0'));
q.add(sys.Unit.define('kilowatt_hour, kWh; kg1*m2*sec-2; 3600000.0'));
q.add(sys.Unit.define('megawatt_hour, MWh; kg1*m2*sec-2; 3.6E9'));
q.add(sys.Unit.define('gigawatt_hour, GWh; kg1*m2*sec-2; 3.6E12'));
q.add(sys.Unit.define('btu, BTU; kg1*m2*sec-2; 1054.852'));
q.add(sys.Unit.define('kilobtu, kBTU; kg1*m2*sec-2; 1054852.0'));
q.add(sys.Unit.define('megabtu, MBTU, MMBTU; kg1*m2*sec-2; 1.054852E9'));
q.add(sys.Unit.define('horsepower_hour, hph; kg1*m2*sec-2; 2686088.6'));
q.add(sys.Unit.define('calorie, cal; kg1*m2*sec-2; 4.184'));
q.add(sys.Unit.define('therm; kg1*m2*sec-2; 1.05506E8'));
q.add(sys.Unit.define('tons_refrigeration_hour, tonrefh; kg1*m2*sec-2; 1.26606708E7'));
q.add(sys.Unit.define('megajoule, MJ; kg1*m2*sec-2; 1000000.0'));
q.add(sys.Unit.define('gigajoule, GJ; kg1*m2*sec-2; 1000000000.0'));
q.add(sys.Unit.define('newton_meter, Nm; kg1*m2*sec-2'));
q.add(sys.Unit.define('cubic_meters_natural_gas, standard_cubic_meter, scm, m³_gas; kg1*m2*sec-2; 37313432.83582089'));
q.add(sys.Unit.define('cubic_feet_natural_gas, standard_cubic_foot, scf, ft³_gas; kg1*m2*sec-2; 1086498'));
q.add(sys.Unit.define('hundred_cubic_feet_natural_gas, Hcf_natural_gas; kg1*m2*sec-2; 108649800'));
q.add(sys.Unit.define('centum_cubic_feet_natural_gas, Ccf_natural_gas; kg1*m2*sec-2; 108649800'));
q.add(sys.Unit.define('thousand_cubic_feet_natural_gas, Mcf_natural_gas; kg1*m2*sec-2; 1086498000'));
q.add(sys.Unit.define('million_cubic_feet_natural_gas, MMcf_natural_gas; kg1*m2*sec-2; 1086498000000'));
sys.Unit.__quantityUnits('energy', q);

// apparent energy
qn.add('apparent energy');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('volt_ampere_hour, VAh; kg1*m2*sec-2; 3600.0'));
q.add(sys.Unit.define('kilovolt_ampere_hour, kVAh; kg1*m2*sec-2; 3600000.0'));
q.add(sys.Unit.define('megavolt_ampere_hour, MVAh; kg1*m2*sec-2; 3.6E9'));
sys.Unit.__quantityUnits('apparent energy', q);

// reactive energy
qn.add('reactive energy');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('volt_ampere_reactive_hour, VARh; kg1*m2*sec-2; 3600.0'));
q.add(sys.Unit.define('kilovolt_ampere_reactive_hour, kVARh; kg1*m2*sec-2; 3600000.0'));
q.add(sys.Unit.define('megavolt_ampere_reactive_hour, MVARh; kg1*m2*sec-2; 3.6E9'));
sys.Unit.__quantityUnits('reactive energy', q);

// energy by area
qn.add('energy by area');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('joules_per_square_meter, J/m²; kg1*sec-2'));
q.add(sys.Unit.define('watt_hours_per_square_meter, Wh/m²; kg1*sec-2; 3600.0'));
q.add(sys.Unit.define('watt_hours_per_square_foot, Wh/ft²; kg1*sec-2; 3.8750077500155E4'));
q.add(sys.Unit.define('kilowatt_hours_per_square_meter, kWh/m²; kg1*sec-2; 3600000.0'));
q.add(sys.Unit.define('kilowatt_hours_per_square_foot, kWh/ft²; kg1*sec-2; 3.8750077500155E7'));
q.add(sys.Unit.define('megawatt_hours_per_square_meter, MWh/m²; kg1*sec-2; 3.6E9'));
q.add(sys.Unit.define('megawatt_hours_per_square_foot, MWh/ft²; kg1*sec-2; 3.8750077500155E10'));
q.add(sys.Unit.define('megajoules_per_square_meter, MJ/m²; kg1*sec-2; 1000000.0'));
q.add(sys.Unit.define('megajoules_per_square_foot, MJ/ft²; kg1*sec-2; 1.076391041671E7'));
q.add(sys.Unit.define('btu_per_square_foot, BTU/ft²; kg1*sec-2; 1.135433731957E4'));
q.add(sys.Unit.define('kilobtu_per_square_foot, kBTU/ft²; kg1*sec-2; 1.135433731957E7'));
q.add(sys.Unit.define('megabtu_per_square_foot, MBTU/ft²; kg1*sec-2; 1.135433731957E10'));
sys.Unit.__quantityUnits('energy by area', q);

// energy by volume
qn.add('energy by volume');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('joules_per_cubic_meter, J/m³; kg1*m-1*sec-2'));
q.add(sys.Unit.define('gigajoules_per_cubic_meter, GJ/m³; kg1*m-1*sec-2; 1000000000.0'));
q.add(sys.Unit.define('kilowatt_hours_per_cubic_meter, kWh/m³; kg1*m-1*sec-2; 3600000.0'));
sys.Unit.__quantityUnits('energy by volume', q);

// enthalpy
qn.add('enthalpy');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('joules_per_gram, J/g; m2*sec-2; 0.0010'));
q.add(sys.Unit.define('joules_per_kilogram, J/kg; m2*sec-2'));
q.add(sys.Unit.define('joules_per_kilogram_dry_air, J/kg_dry; m2*sec-2'));
q.add(sys.Unit.define('btu_per_pound, BTU/lb; m2*sec-2; 2325.5576058607867'));
q.add(sys.Unit.define('btus_per_pound_dry_air, btu/lb_dry; m2*sec-2; 2326.0'));
q.add(sys.Unit.define('kilojoules_per_kilogram, kJ/kg; m2*sec-2; 1000.0'));
q.add(sys.Unit.define('kilojoules_per_kilogram_dry_air, kJ/kg_dry; m2*sec-2; 1000.0'));
q.add(sys.Unit.define('megajoules_per_kilogram_dry_air, MJ/kg_dry; m2*sec-2; 1000000.0'));
q.add(sys.Unit.define('calorie_per_gram, cal/g; m2*sec-2; 4184.0'));
sys.Unit.__quantityUnits('enthalpy', q);

// entropy
qn.add('entropy');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('joules_per_degree_kelvin, J/°K; kg1*m2*sec-2*K-1'));
q.add(sys.Unit.define('kilojoules_per_degree_kelvin, kJ/°K; kg1*m2*sec-2*K-1; 1000.0'));
q.add(sys.Unit.define('megajoules_per_degree_kelvin, MJ/°K; kg1*m2*sec-2*K-1; 1000000.0'));
sys.Unit.__quantityUnits('entropy', q);

// force
qn.add('force');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('newton, N; kg1*m1*sec-2'));
q.add(sys.Unit.define('pound_force, lbf; kg1*m1*sec-2; 4.448222'));
sys.Unit.__quantityUnits('force', q);

// frequency
qn.add('frequency');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('hertz, Hz; sec-1'));
q.add(sys.Unit.define('kilohertz, kHz; sec-1; 1000.0'));
q.add(sys.Unit.define('cycles_per_hour, cph; sec-1; 2.777777777777778E-4'));
q.add(sys.Unit.define('cycles_per_minute, cpm; sec-1; 0.016666666666666666'));
q.add(sys.Unit.define('megahertz, MHz; sec-1; 1000000.0'));
q.add(sys.Unit.define('per_minute, /min; sec-1; 0.016666666666666666'));
q.add(sys.Unit.define('per_second, /s; sec-1'));
q.add(sys.Unit.define('per_hour, /h; sec-1; 2.777777777777778E-4'));
q.add(sys.Unit.define('percent_per_second, %/s; sec-1'));
q.add(sys.Unit.define('air_changes_per_hour, ACH; sec-1; 2.777777777777778E-4'));
sys.Unit.__quantityUnits('frequency', q);

// grammage
qn.add('grammage');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('kilograms_per_square_meter, kg/m²; kg1*m-2'));
q.add(sys.Unit.define('grams_per_square_meter, g/m²; kg1*m-2; 0.0010'));
sys.Unit.__quantityUnits('grammage', q);

// heating rate
qn.add('heating rate');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('degrees_kelvin_per_second, K/s; sec-1*K1'));
q.add(sys.Unit.define('degrees_celsius_per_hour, °C/h; sec-1*K1; 2.777777777777778E-4'));
q.add(sys.Unit.define('degrees_celsius_per_minute, °C/min; sec-1*K1; 0.016666666666666666'));
q.add(sys.Unit.define('degrees_fahrenheit_per_hour, °F/h; sec-1*K1; 1.5432098765432E-4'));
q.add(sys.Unit.define('degrees_fahrenheit_per_minute, °F/min; sec-1*K1; 0.0092592592592593'));
q.add(sys.Unit.define('degrees_kelvin_per_hour, K/h; sec-1*K1; 2.777777777777778E-4'));
q.add(sys.Unit.define('degrees_kelvin_per_minute, K/min; sec-1*K1; 0.016666666666666666'));
sys.Unit.__quantityUnits('heating rate', q);

// illuminance
qn.add('illuminance');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('lux, lx; m-2*cd1'));
q.add(sys.Unit.define('footcandle, fc; m-2*cd1; 0.092937'));
q.add(sys.Unit.define('phot; m-2*cd1; 10000.0'));
sys.Unit.__quantityUnits('illuminance', q);

// inductance
qn.add('inductance');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('henry, H; kg1*m2*sec-2*A-2'));
sys.Unit.__quantityUnits('inductance', q);

// irradiance
qn.add('irradiance');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('watts_per_square_meter_irradiance, W/m²_irr; kg1*sec-3'));
q.add(sys.Unit.define('watts_per_square_foot_irradiance, W/ft²_irr; kg1*sec-3; 10.76391041671'));
sys.Unit.__quantityUnits('irradiance', q);

// length
qn.add('length');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('meter, m; m1'));
q.add(sys.Unit.define('micrometer, µm; m1; 1.0E-5'));
q.add(sys.Unit.define('millimeter, mm; m1; 0.0010'));
q.add(sys.Unit.define('centimeter, cm; m1; 0.01'));
q.add(sys.Unit.define('kilometer, km; m1; 1000.0'));
q.add(sys.Unit.define('inch, in; m1; 0.0254'));
q.add(sys.Unit.define('foot, ft; m1; 0.3048'));
q.add(sys.Unit.define('yard, yd; m1; 0.9144'));
q.add(sys.Unit.define('mile; m1; 1609.344'));
sys.Unit.__quantityUnits('length', q);

// luminance
qn.add('luminance');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('candelas_per_square_meter, cd/m²; m-2*cd1'));
q.add(sys.Unit.define('candels_per_square_foot, cd/ft²; m-2*cd1; 0.092937'));
sys.Unit.__quantityUnits('luminance', q);

// luminous flux
qn.add('luminous flux');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('lumen, lm; cd1'));
sys.Unit.__quantityUnits('luminous flux', q);

// luminous intensity
qn.add('luminous intensity');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('candela, cd; cd1'));
sys.Unit.__quantityUnits('luminous intensity', q);

// magnetic field strength
qn.add('magnetic field strength');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('amperes_per_meter, A/m; m-1*A1'));
sys.Unit.__quantityUnits('magnetic field strength', q);

// magnetic flux
qn.add('magnetic flux');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('weber, Wb; kg1*m2*sec-2*A-1'));
sys.Unit.__quantityUnits('magnetic flux', q);

// magnetic flux density
qn.add('magnetic flux density');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('tesla, T; kg1*sec-2*A-1'));
sys.Unit.__quantityUnits('magnetic flux density', q);

// mass
qn.add('mass');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('kilogram, kg; kg1'));
q.add(sys.Unit.define('milligram, mg; kg1; 1.0E-6'));
q.add(sys.Unit.define('gram, g; kg1; 0.0010'));
q.add(sys.Unit.define('ounce, oz; kg1; 0.02835'));
q.add(sys.Unit.define('pound, lb; kg1; 0.453591'));
q.add(sys.Unit.define('kilopound, klb; kg1; 453.591'));
q.add(sys.Unit.define('metric_ton, ton; kg1; 1000.0'));
q.add(sys.Unit.define('short_ton, t; kg1; 907.18474'));
sys.Unit.__quantityUnits('mass', q);

// mass flow
qn.add('mass flow');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('kilograms_per_second, kg/s; kg1*sec-1'));
q.add(sys.Unit.define('kilograms_per_minute, kg/min; kg1*sec-1; 0.016666666666666666'));
q.add(sys.Unit.define('kilograms_per_hour, kg/h; kg1*sec-1; 2.777777777777778E-4'));
q.add(sys.Unit.define('pounds_per_minute, lb/min; kg1*sec-1; 0.007559872833333333'));
q.add(sys.Unit.define('pounds_per_hour, lb/h; kg1*sec-1; 1.2599788055555556E-4'));
q.add(sys.Unit.define('pounds_per_second, lb/s; kg1*sec-1; 0.45359237'));
q.add(sys.Unit.define('kilopounds_per_hour, klb/h; kg1*sec-1; 0.12599788055555556'));
q.add(sys.Unit.define('grams_per_second, g/s; kg1*sec-1; 0.0010'));
q.add(sys.Unit.define('grams_per_minute, g/min; kg1*sec-1; 1.6666666666666667E-5'));
q.add(sys.Unit.define('metric_tons_per_hour, ton/h; kg1*sec-1; 0.2777777777777778'));
sys.Unit.__quantityUnits('mass flow', q);

// momentum
qn.add('momentum');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('newton_second, Ns; kg1*m1*sec-1'));
sys.Unit.__quantityUnits('momentum', q);

// power
qn.add('power');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('watt, W; kg1*m2*sec-3'));
q.add(sys.Unit.define('milliwatt, mW; kg1*m2*sec-3; 0.0010'));
q.add(sys.Unit.define('kilowatt, kW; kg1*m2*sec-3; 1000.0'));
q.add(sys.Unit.define('megawatt, MW; kg1*m2*sec-3; 1000000.0'));
q.add(sys.Unit.define('gigawatt, GW; kg1*m2*sec-3; 1.0E9'));
q.add(sys.Unit.define('btus_per_hour, BTU/h; kg1*m2*sec-3; 0.292875'));
q.add(sys.Unit.define('therms_per_hour, therm/h; kg1*m2*sec-3; 29287.5'));
q.add(sys.Unit.define('horsepower, hp; kg1*m2*sec-3; 745.7'));
q.add(sys.Unit.define('foot_pounds_per_second, ftlbs/sec; kg1*m2*sec-3; 1.355818'));
q.add(sys.Unit.define('tons_refrigeration, tonref; kg1*m2*sec-3; 3516.853'));
q.add(sys.Unit.define('kilobtus_per_hour, kBTU/h; kg1*m2*sec-3; 293.07107017222'));
q.add(sys.Unit.define('megabtus_per_hour, MBTU/h, MMBTU/h; kg1*m2*sec-3; 293071.07017222'));
q.add(sys.Unit.define('joules_per_hour, J/h; kg1*m2*sec-3; 0.000277777778'));
q.add(sys.Unit.define('kilojoules_per_hour, kJ/h; kg1*m2*sec-3; 0.277777778'));
q.add(sys.Unit.define('megajoules_per_hour, MJ/h; kg1*m2*sec-3; 277.777778'));
q.add(sys.Unit.define('gigajoules_per_hour, GJ/h; kg1*m2*sec-3; 277777.778'));
sys.Unit.__quantityUnits('power', q);

// power by area
qn.add('power by area');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('watts_per_square_meter, W/m²; kg1*sec-3'));
q.add(sys.Unit.define('watts_per_square_foot, W/ft²; kg1*sec-3; 10.7639104'));
q.add(sys.Unit.define('kilowatts_per_square_meter, kW/m²; kg1*sec-3; 1000.0'));
q.add(sys.Unit.define('kilowatts_per_square_foot, kW/ft²; kg1*sec-3; 10763.9104'));
q.add(sys.Unit.define('kilobtus_per_hour_per_square_foot, kBTU/h/ft²; kg1*sec-3; 3153.8257472'));
sys.Unit.__quantityUnits('power by area', q);

// power by volumetric flow
qn.add('power by volumetric flow');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('watts_per_cubic_meters_per_second, W/m³/s; kg1*m-1*sec-2'));
q.add(sys.Unit.define('watts_per_cubic_feet_per_minute, W/cfm; kg1*m-1*sec-2; 2118.8800032893155'));
q.add(sys.Unit.define('kilowatts_per_kilocubic_feet_per_minute, kW/kcfm; kg1*m-1*sec-2; 2118.8800032893155'));
q.add(sys.Unit.define('kilowatts_per_gallons_per_minute, kW/gal/min; kg1*m-1*sec-2; 15850323'));
sys.Unit.__quantityUnits('power by volumetric flow', q);

// apparent power
qn.add('apparent power');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('volt_ampere, VA; kg1*m2*sec-3'));
q.add(sys.Unit.define('kilovolt_ampere, kVA; kg1*m2*sec-3; 1000.0'));
q.add(sys.Unit.define('megavolt_ampere, mVA; kg1*m2*sec-3; 1000000.0'));
sys.Unit.__quantityUnits('apparent power', q);

// reactive power
qn.add('reactive power');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('volt_ampere_reactive, VAR; kg1*m2*sec-3'));
q.add(sys.Unit.define('kilovolt_ampere_reactive, kVAR; kg1*m2*sec-3; 1000.0'));
q.add(sys.Unit.define('megavolt_ampere_reactive, MVAR; kg1*m2*sec-3; 1000000.0'));
sys.Unit.__quantityUnits('reactive power', q);

// pressure
qn.add('pressure');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('pascal, Pa; kg1*m-1*sec-2'));
q.add(sys.Unit.define('kilopascal, kPa; kg1*m-1*sec-2; 1000.0'));
q.add(sys.Unit.define('bar; kg1*m-1*sec-2; 100000.0'));
q.add(sys.Unit.define('atmosphere, atm; kg1*m-1*sec-2; 101317.1'));
q.add(sys.Unit.define('pounds_per_square_inch, psi; kg1*m-1*sec-2; 6894.73'));
q.add(sys.Unit.define('centimeters_of_water, cmH₂O; kg1*m-1*sec-2; 98.0665'));
q.add(sys.Unit.define('inches_of_water, in/wc, inH₂O; kg1*m-1*sec-2; 248.84'));
q.add(sys.Unit.define('millimeters_of_mercury, mmHg; kg1*m-1*sec-2; 133.322368421'));
q.add(sys.Unit.define('centimeters_of_mercury, cmHg; kg1*m-1*sec-2; 1333.22368421'));
q.add(sys.Unit.define('inches_of_mercury, inHg; kg1*m-1*sec-2; 3386.38815789'));
q.add(sys.Unit.define('hectopascal, hPa; kg1*m-1*sec-2; 100.0'));
q.add(sys.Unit.define('millibar, mbar; kg1*m-1*sec-2; 100.0'));
sys.Unit.__quantityUnits('pressure', q);

// specific entropy
qn.add('specific entropy');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('joules_per_kilogram_degree_kelvin, J/kg°K; m2*sec-2*K-1'));
sys.Unit.__quantityUnits('specific entropy', q);

// surface tension
qn.add('surface tension');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('newtons_per_meter, N/m; kg1*sec-2'));
sys.Unit.__quantityUnits('surface tension', q);

// temperature
qn.add('temperature');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('fahrenheit, °F; K1; 0.5555555555555556; 255.37222222222223'));
q.add(sys.Unit.define('celsius, °C; K1; 1.0; 273.15'));
q.add(sys.Unit.define('kelvin, K; K1'));
sys.Unit.__quantityUnits('temperature', q);

// temperature differential
qn.add('temperature differential');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('fahrenheit_degrees, Δ°F; K1; 0.5555555555555556'));
q.add(sys.Unit.define('celsius_degrees, Δ°C; K1'));
q.add(sys.Unit.define('kelvin_degrees, ΔK; K1'));
sys.Unit.__quantityUnits('temperature differential', q);

// thermal conductivity
qn.add('thermal conductivity');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('watts_per_meter_degree_kelvin, W/m°K; kg1*m1*sec-3*K-1'));
sys.Unit.__quantityUnits('thermal conductivity', q);

// time
qn.add('time');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('nanosecond, ns; sec1; 1.0E-9'));
q.add(sys.Unit.define('microsecond, µs; sec1; 1.0E-6'));
q.add(sys.Unit.define('millisecond, ms; sec1; 0.0010'));
q.add(sys.Unit.define('hundredths_second, cs; sec1; 0.01'));
q.add(sys.Unit.define('tenths_second, ds; sec1; 0.1'));
q.add(sys.Unit.define('second, s, sec; sec1'));
q.add(sys.Unit.define('minute, min; sec1; 60.0'));
q.add(sys.Unit.define('hour, h, hr; sec1; 3600.0'));
q.add(sys.Unit.define('day; sec1; 86400.0'));
q.add(sys.Unit.define('week, wk; sec1; 604800.0'));
q.add(sys.Unit.define('julian_month, mo; sec1; 2629800.0'));
q.add(sys.Unit.define('year, yr; sec1; 3.1536E7'));
sys.Unit.__quantityUnits('time', q);

// velocity
qn.add('velocity');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('meters_per_second, m/s; m1*sec-1'));
q.add(sys.Unit.define('kilometers_per_second, km/s; m1*sec-1; 1000.0'));
q.add(sys.Unit.define('kilometers_per_hour, km/h; m1*sec-1; 0.277778'));
q.add(sys.Unit.define('miles_per_hour, mph; m1*sec-1; 0.447027'));
q.add(sys.Unit.define('feet_per_second, ft/s; m1*sec-1; 0.3048'));
q.add(sys.Unit.define('feet_per_minute, ft/min; m1*sec-1; 0.00508'));
q.add(sys.Unit.define('inches_per_hour, in/h; m1*sec-1; 7.0555555555555556E-6'));
q.add(sys.Unit.define('millimeters_per_second, mm/s; m1*sec-1; 0.0010'));
q.add(sys.Unit.define('millimeters_per_minute, mm/min; m1*sec-1; 1.6666666666666667E-5'));
q.add(sys.Unit.define('millimeters_per_hour, mm/h; m1*sec-1; 2.7777777777777778E-7'));
q.add(sys.Unit.define('meters_per_minute, m/min; m1*sec-1; 0.016666666666666666'));
q.add(sys.Unit.define('meters_per_hour, m/h; m1*sec-1; 2.777777777777778E-4'));
q.add(sys.Unit.define('knot; m1*sec-1; 0.5144'));
q.add(sys.Unit.define('cubic_feet_per_minute_per_square_foot, cfm/ft²; m1*sec-1; 0.00508'));
sys.Unit.__quantityUnits('velocity', q);

// volume
qn.add('volume');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('cubic_meter, m³; m3'));
q.add(sys.Unit.define('cubic_millimeter, mm³; m3; 1.0E-9'));
q.add(sys.Unit.define('cubic_centimeter, cm³; m3; 1.0E-6'));
q.add(sys.Unit.define('milliliter, mL; m3; 1.0E-6'));
q.add(sys.Unit.define('hectoliter, hL; m3; 0.10'));
q.add(sys.Unit.define('liter, L; m3; 0.0010'));
q.add(sys.Unit.define('kiloliter, kL; m3'));
q.add(sys.Unit.define('cubic_inch, in³; m3; 1.6387064E-5'));
q.add(sys.Unit.define('cubic_foot, ft³; m3; 0.028316846592'));
q.add(sys.Unit.define('cubic_yard, yd³; m3; 0.764555'));
q.add(sys.Unit.define('gallon, gal; m3; 0.003785'));
q.add(sys.Unit.define('kilogallon, kgal; m3; 3.785'));
q.add(sys.Unit.define('quart, qt; m3; 9.46E-4'));
q.add(sys.Unit.define('pint, pt; m3; 4.73E-4'));
q.add(sys.Unit.define('fluid_ounce, fl_oz; m3; 2.95729E-5'));
q.add(sys.Unit.define('imperial_gallon, galUK; m3; 0.004546092'));
q.add(sys.Unit.define('hecto_cubic_foot, hft³; m3; 2.8316846592'));
q.add(sys.Unit.define('hundred_cubic_feet, Hcf; m3; 2.8316846592'));
q.add(sys.Unit.define('centum_cubic_feet, Ccf; m3; 2.8316846592'));
q.add(sys.Unit.define('thousand_cubic_feet, Mcf; m3; 28.316846592'));
q.add(sys.Unit.define('million_cubic_feet, MMcf; m3; 28316.846592'));
sys.Unit.__quantityUnits('volume', q);

// volumetric flow
qn.add('volumetric flow');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('cubic_meters_per_second, m³/s; m3*sec-1'));
q.add(sys.Unit.define('milliliters_per_second, mL/s; m3*sec-1; 1.0E-6'));
q.add(sys.Unit.define('hectoliters_per_second, hL/s; m3*sec-1; 0.10'));
q.add(sys.Unit.define('liters_per_second, L/s; m3*sec-1; 0.0010'));
q.add(sys.Unit.define('cubic_feet_per_second, cfs; m3*sec-1; 0.028317'));
q.add(sys.Unit.define('cubic_feet_per_minute, cfm; m3*sec-1; 4.719474432E-4'));
q.add(sys.Unit.define('cubic_feet_per_hour, cfh; m3*sec-1; 0.000007866'));
q.add(sys.Unit.define('kilocubic_feet_per_minute, kcfm; m3*sec-1; 0.4719474432'));
q.add(sys.Unit.define('imperial_gallons_per_minute, galUK/min; m3*sec-1; 0.004546092'));
q.add(sys.Unit.define('liters_per_minute, L/min; m3*sec-1; 1.6666666666666667E-5'));
q.add(sys.Unit.define('gallons_per_minute, gal/min; m3*sec-1; 6.30901964E-5'));
q.add(sys.Unit.define('gallons_per_hour, gal/hr, gph; m3*sec-1; 1.0515033E-6'));
q.add(sys.Unit.define('liters_per_hour, L/h; m3*sec-1; 2.7777777777777776E-7'));
q.add(sys.Unit.define('cubic_meters_per_minute, m³/min; m3*sec-1; 0.016666666666666666'));
q.add(sys.Unit.define('cubic_meters_per_hour, m³/h; m3*sec-1; 2.777777777777778E-4'));
sys.Unit.__quantityUnits('volumetric flow', q);

// bytes
qn.add('bytes');
q = sys.List.make(sys.Unit.type$, []);
q.add(sys.Unit.define('byte'));
q.add(sys.Unit.define('kilobyte, kB; ; 1024'));
q.add(sys.Unit.define('megabyte, MB; ; 1048576'));
q.add(sys.Unit.define('gigabyte, GB; ; 1073741824'));
q.add(sys.Unit.define('terabyte, TB; ; 1099511627776'));
q.add(sys.Unit.define('petabyte, PB; ; 1125899906842624'));
sys.Unit.__quantityUnits('bytes', q);

sys.Unit.__quantities(qn);

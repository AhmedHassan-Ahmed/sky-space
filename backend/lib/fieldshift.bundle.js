/**
 * FieldShift - Standalone Distribution Bundle
 * Generated for both direct script-tag inclusion (file:// and offline) and HTTP ES module fallback.
 */
(function(root) {
  'use strict';

  // Bundled Data Catalog & Fallback Presets
  const fallbackPresets = {"_about":{"purpose":"Small offline fallback used only when the live NASA POWER / MODIS / SoilGrids APIs fail or time out.","derivedFrom":"Monthly means of the 2025 NASA POWER daily point series, daily Tmax rounded to 0.1 C, 23 QA-screened MODIS MOD13Q1 NDVI composites, and SoilGrids 0-15 cm values at each regional centroid.","baseYear":2025,"warning":"Regional illustrative values, never attributed to a user's field as observations."},"fayoum_etsa":{"id":"fayoum_etsa","nameEn":"Fayoum · Etsa tail-end","nameAr":"الفيوم · إطسا، نهاية الترعة","lat":29.2315,"lon":30.7952,"defaults":{"landType":"old_clay","irrigationType":"flood","canalPosition":"tail","salinityLevel":"moderate"},"soil":{"clay":26.9,"sand":53.1,"soc":23.733,"nitrogen":2.01,"phh2o":7.3},"soilOrigin":"SoilGrids 2.0 at regional centroid","climateMonthly":[{"tmax":21.776,"tmin":8.908,"precipitation":0.022,"evapotranspiration":0,"rootWetness":0.36,"topWetness":0.138},{"tmax":20.202,"tmin":6.355,"precipitation":0.02,"evapotranspiration":0,"rootWetness":0.36,"topWetness":0.143},{"tmax":27.08,"tmin":10.676,"precipitation":0.714,"evapotranspiration":0.004,"rootWetness":0.375,"topWetness":0.306},{"tmax":30.599,"tmin":14.43,"precipitation":0,"evapotranspiration":0,"rootWetness":0.36,"topWetness":0.16},{"tmax":34.676,"tmin":18.151,"precipitation":0.313,"evapotranspiration":0,"rootWetness":0.361,"topWetness":0.154},{"tmax":36.794,"tmin":19.617,"precipitation":0.024,"evapotranspiration":0,"rootWetness":0.36,"topWetness":0.134},{"tmax":39.397,"tmin":22.875,"precipitation":0.023,"evapotranspiration":0,"rootWetness":0.356,"topWetness":0.105},{"tmax":38.734,"tmin":23.622,"precipitation":0,"evapotranspiration":0,"rootWetness":0.35,"topWetness":0.087},{"tmax":35.372,"tmin":20.732,"precipitation":0.006,"evapotranspiration":0,"rootWetness":0.35,"topWetness":0.089},{"tmax":31.999,"tmin":17.575,"precipitation":0.001,"evapotranspiration":0,"rootWetness":0.35,"topWetness":0.09},{"tmax":27.953,"tmin":15.105,"precipitation":0.047,"evapotranspiration":0,"rootWetness":0.359,"topWetness":0.127},{"tmax":21.506,"tmin":9.269,"precipitation":0.435,"evapotranspiration":0,"rootWetness":0.371,"topWetness":0.331}],"tmaxDaily":[20,21.1,20.5,19.4,20.3,21.1,21.4,20.8,22.2,20.9,20.5,21.6,23,20.2,20.9,25.1,24.5,22.7,18.8,23.9,25.2,22.7,21.7,22,22,23.2,21.7,21.1,21.8,22.8,22.1,21.5,22.9,23.8,22.6,20.5,18.8,19.3,18.5,18.3,19.3,18.9,18.9,19,21.6,20.1,21.5,23.4,23.6,23.1,21.5,18.7,18.1,17.7,17.4,15.3,18.1,21.7,21.8,21.7,24.3,23.3,20.1,21.1,20.7,23,22.3,25,26.4,27.1,28.2,30.6,32.8,31.6,34.6,35.1,29.7,25.9,20.7,20.2,20.5,23.6,28.9,33.8,34.3,36.2,32.2,25.8,28,31.5,28.4,29,28.7,27.1,31.1,33.2,30.7,38.5,28.9,23.1,23.8,26.2,24.2,25.6,27.5,29.4,31.8,32.8,33.9,34.2,38,39.9,38.3,27.6,29.9,29.5,30.6,31.6,33.4,31.3,28.6,28.5,26.9,27.3,30.2,34.1,36.7,37,39.1,39.5,41.2,34,37,32.4,32.2,40.9,44.5,37.3,33.8,32.5,32.4,31.3,34.9,38,39.3,40,31.7,32.1,33.9,34.5,33.1,32.8,32,32.6,35.6,36.6,37.2,37.6,36.7,36.6,38.5,38.1,38.3,39,38.5,36.1,35.4,35.3,36.7,36.3,37,37.6,38,36.4,36.5,37,36.3,37.2,38.8,39.6,39.2,39.3,37.6,38.4,38.6,38.9,38.8,39.1,38.9,38.3,39.5,38.4,37.7,37.2,36.5,37.1,39.8,41,40.7,39.2,38.6,38.3,39.5,41.6,41.6,41.6,42.8,43.2,42,40.4,38.9,37.7,36.7,36,37.3,37.2,36.9,37.9,36.4,36.8,39,40.8,41,43.1,43.8,43.9,42,37.9,37.8,40.1,41.6,37.9,37.6,38.4,40.2,40.1,37.2,36.3,36,35.9,37.4,38.5,38.9,39.6,38.6,36.6,36.6,38,37.1,36.1,34.9,34.6,34.2,35.4,36.5,37.3,38.2,36.5,33.9,34.6,35.7,34.8,34.3,33.1,32.2,33.3,33.6,32.5,32.8,34,34.3,35.7,36.2,34.3,37.5,34.7,33.3,32.1,30.7,32.4,33.6,29.9,29.7,29.7,30.1,29.7,29.9,29.7,30.2,30.5,31.1,32.1,35,35.6,34.7,33.7,33,33.1,31.3,30.9,30.8,31.5,30.2,30.8,31.4,31.7,34.4,33.2,30.8,29,28.8,29.3,31.1,29.9,27.5,27,25.9,24.8,25.3,25.4,25.6,25.5,28.1,29.2,31.4,32.5,32.2,26.7,24.2,24.2,24.5,23.1,23.5,22.3,21.9,23.3,24.1,25.9,24.8,22.5,19.9,20.2,20.3,20.8,20.9,21.2,21.4,21.4,21.9,20.8,21.2,20.8,20.1,21.4,22.4,20.5,20.2,20.5,22.3,21.5,21.1,20.4,21.2,21,20.8],"ndvi16Day":[0.803,0.825,0.826,0.806,0.766,0.774,0.648,0.561,0.575,0.648,0.658,0.748,0.728,0.725,0.734,0.726,0.733,0.622,0.574,null,0.688,0.742,null]},"delta_kafr_el_sheikh":{"id":"delta_kafr_el_sheikh","nameEn":"North Delta · Kafr El-Sheikh","nameAr":"شمال الدلتا · كفر الشيخ","lat":31.1107,"lon":30.9388,"defaults":{"landType":"old_clay","irrigationType":"modified_surface","canalPosition":"middle","salinityLevel":"high"},"soil":{"clay":48,"sand":19,"phh2o":8.3,"soc":12.4,"nitrogen":1.4},"soilOrigin":"illustrative (SoilGrids profile unavailable at centroid)","climateMonthly":[{"tmax":22.468,"tmin":10.31,"precipitation":0.018,"evapotranspiration":0,"rootWetness":0.46,"topWetness":0.204},{"tmax":20.491,"tmin":8.941,"precipitation":0.12,"evapotranspiration":0,"rootWetness":0.46,"topWetness":0.201},{"tmax":27.777,"tmin":11.88,"precipitation":0.056,"evapotranspiration":0,"rootWetness":0.46,"topWetness":0.203},{"tmax":29.78,"tmin":13.877,"precipitation":0.06,"evapotranspiration":0,"rootWetness":0.46,"topWetness":0.167},{"tmax":34.746,"tmin":17.323,"precipitation":0.169,"evapotranspiration":0,"rootWetness":0.458,"topWetness":0.16},{"tmax":37.659,"tmin":19.676,"precipitation":0.178,"evapotranspiration":0,"rootWetness":0.46,"topWetness":0.181},{"tmax":40.256,"tmin":22.525,"precipitation":0.036,"evapotranspiration":0,"rootWetness":0.458,"topWetness":0.17},{"tmax":39.14,"tmin":23.669,"precipitation":0,"evapotranspiration":0,"rootWetness":0.45,"topWetness":0.118},{"tmax":35.665,"tmin":21.291,"precipitation":0.579,"evapotranspiration":0.002,"rootWetness":0.462,"topWetness":0.26},{"tmax":32.603,"tmin":18.752,"precipitation":0.009,"evapotranspiration":0,"rootWetness":0.46,"topWetness":0.167},{"tmax":29.473,"tmin":17.014,"precipitation":0.138,"evapotranspiration":0,"rootWetness":0.46,"topWetness":0.165},{"tmax":22.855,"tmin":11.969,"precipitation":0.264,"evapotranspiration":0,"rootWetness":0.463,"topWetness":0.314}],"tmaxDaily":[21.4,20.7,21.3,20.1,20.5,21.8,23.4,23.3,24.8,21.7,22.6,23.5,24.6,24.7,22.8,22.9,21.1,22.8,20.6,22.5,23.9,22.3,21.5,23.1,22,23,22.6,21.8,22.4,24.4,22.4,21.7,23.2,22.3,22.9,21.2,18.4,19.2,19.6,18.6,18.9,19.9,19.1,19.2,21.1,22.7,23.1,24.2,24.8,21.1,18.9,18.9,18.2,16.7,16.4,18.1,20.5,22.1,22.7,22.5,24,21.2,22.2,23.2,22.1,24.2,25.7,26.2,26.9,27.5,29.7,33.5,34.1,32.3,36,36.2,29.2,26.2,20.3,20.2,21.5,24.8,26.9,31.5,33.1,38.1,32.6,26.5,29.5,33.1,29.7,30.2,29.1,26.4,30.2,31.2,31.4,35.5,27.6,23.1,22.8,25.4,21.8,25.4,28.8,28.5,31.1,31.9,34.7,33.6,36.7,40.3,31.1,24.1,29.9,29.3,30.5,29.8,31.6,31.7,29.2,28.9,26.1,25.2,31.6,35.9,36.4,36.9,39.5,39,42.9,33.2,37.3,31.3,32.8,39.6,40.5,34.2,31.5,31.2,31.6,34.8,37.8,39.4,41.8,42.1,31,32.4,33.9,34.5,34.7,33.2,32.3,33.8,36.3,37.6,39.1,37.8,37.7,38.7,39.5,38.9,39,39.5,36.8,35.6,35.5,37,37.4,38,38.8,38.6,36.7,34.9,38,38,38.8,40.4,41.4,40.3,40.2,40.1,39.4,40.9,38.7,38.8,38.7,40.2,40,39.9,41.6,40.6,38.6,36.8,37.6,39.2,41.1,41.7,39.9,38.6,39.1,39.3,43.4,43.6,43.1,42.7,44.6,42.9,42,39.4,38.4,37,37.1,37.3,38.1,37.4,37.6,38.6,36.6,38.1,41.6,43.2,43.4,42.5,42.6,42.4,40.3,37.1,37.1,40.4,42.6,37.8,39.1,39.8,41.6,39.1,37.3,37.1,36.3,36.5,38,37.6,39.2,39.6,37.5,36.5,38,39.1,36.6,34.8,33.9,33.7,33.8,36.2,37.7,38.4,37.4,35.1,33.8,35.7,36.4,35.1,33.9,33.6,33.9,35.2,33.3,33.2,35.2,35.6,35,35.9,35.5,33,37.1,35.7,34.5,31.9,31.8,33.6,32.7,30.4,30.6,31,30.1,31.4,30.9,30.2,31.6,30.3,31.5,32.8,34.6,34.5,35.7,35.3,34.9,34.6,32.5,31.9,31.6,31.9,30.5,31.6,31,32,30.7,35.3,34,30.8,30.9,30.4,31,31.5,28.6,27.1,27,24.6,27.1,27.1,27.2,28,32.2,32.8,34.3,35.1,34.5,26.6,24.8,25.4,27.5,26.6,25.9,24.1,25,24.4,25.5,27.9,26.4,23.4,21.4,21.9,20.1,21.1,22.2,23.1,23,22.8,22.4,21.7,21.1,22.8,22.8,24,24.5,23.2,22.6,23.5,23.4,23.1,21.9,19.8,21.5,20.8,21.2],"ndvi16Day":[null,null,null,null,null,0.141,null,0.13,0.12,0.114,0.132,0.105,0.124,null,0.133,0.118,0.118,0.116,0.113,0.13,null,0.159,0.142]},"west_delta_nubariya":{"id":"west_delta_nubariya","nameEn":"West Delta · Nubariya","nameAr":"غرب الدلتا · النوبارية","lat":30.665,"lon":30.068,"defaults":{"landType":"new_sandy","irrigationType":"drip","canalPosition":"head","salinityLevel":"none"},"soil":{"clay":25.233,"sand":41.267,"soc":6.833,"nitrogen":0.857,"phh2o":8},"soilOrigin":"SoilGrids 2.0 at regional centroid","climateMonthly":[{"tmax":21.099,"tmin":9.368,"precipitation":0.066,"evapotranspiration":0,"rootWetness":0.314,"topWetness":0.252},{"tmax":19.255,"tmin":8.239,"precipitation":0.147,"evapotranspiration":0,"rootWetness":0.311,"topWetness":0.237},{"tmax":26.295,"tmin":11.185,"precipitation":0.331,"evapotranspiration":0,"rootWetness":0.316,"topWetness":0.253},{"tmax":28.277,"tmin":13.158,"precipitation":0.049,"evapotranspiration":0,"rootWetness":0.31,"topWetness":0.158},{"tmax":32.626,"tmin":16.921,"precipitation":0.39,"evapotranspiration":0,"rootWetness":0.312,"topWetness":0.165},{"tmax":34.766,"tmin":18.6,"precipitation":0.463,"evapotranspiration":0.001,"rootWetness":0.311,"topWetness":0.176},{"tmax":37.449,"tmin":21.358,"precipitation":0.074,"evapotranspiration":0.001,"rootWetness":0.312,"topWetness":0.176},{"tmax":37.051,"tmin":22.909,"precipitation":0,"evapotranspiration":0,"rootWetness":0.306,"topWetness":0.108},{"tmax":33.898,"tmin":20.615,"precipitation":0.294,"evapotranspiration":0,"rootWetness":0.31,"topWetness":0.19},{"tmax":30.79,"tmin":17.646,"precipitation":0.026,"evapotranspiration":0,"rootWetness":0.31,"topWetness":0.154},{"tmax":27.164,"tmin":15.432,"precipitation":0.149,"evapotranspiration":0,"rootWetness":0.31,"topWetness":0.177},{"tmax":21.347,"tmin":11.03,"precipitation":0.179,"evapotranspiration":0,"rootWetness":0.313,"topWetness":0.251}],"tmaxDaily":[20.2,20,19.7,20.4,20.5,20.9,21,21.5,22.2,19.7,19.9,21.4,22.2,22.3,21.4,22.7,20.1,22.3,18.8,21.1,23,21,20.2,21.7,22.1,21.1,21.3,21.2,21.6,21.4,21.3,20.6,20.7,21.4,20.5,19.9,16.8,19.1,18.9,16.8,18.9,17.9,17.7,18.2,20.3,20.7,21.4,22.9,22,21.2,18.3,17.7,16.9,16.7,16.1,16.8,18.8,21,20.8,21.2,22.8,19.9,20.5,20.9,21.4,23.2,23.8,24.5,26.8,27.1,27.9,30.9,33.2,31.9,34.7,34.6,26.2,23.8,18.2,18.9,19.9,24.3,27.7,31.3,33.4,35.5,26.1,25,28.2,31.5,27.3,28,27,25.2,29.2,28.5,29.3,32.5,25.8,21.3,20.9,24.5,22.4,24.8,27,29.1,31.2,31.9,32.9,31.9,36.5,38.6,29.5,24.6,27.4,27.7,28.6,28.3,30,26.3,26.7,26.6,24,25.9,30.2,34.5,35.7,37.2,38.6,38.9,40.8,31.2,34.6,29.6,30.7,38.1,35.5,31.1,30.1,29.4,29.4,32.7,35.4,38.5,39.4,33.4,27.9,30.6,31.8,32.5,30.4,30.1,29.9,31.5,34.9,35.7,36.1,35.6,34.6,35.2,36.9,36,35.8,37.4,34.9,33.1,32.3,33.7,35.9,35.1,36,36,35.1,32.4,36,34.6,35.3,35.4,36.2,35.5,35.8,35,35.2,37.8,36,37.4,37.1,37.4,36.2,37.3,38.5,35.6,35.4,34.4,34.6,36.2,38.3,38.7,38.4,37.3,36.5,36.7,39.9,41.4,40.4,40.1,41.7,40.6,39.5,36.9,35.8,34.6,34.3,34.8,35.7,35.6,36,35.8,33.9,35.7,37.1,39.4,39.4,41.5,42.5,41.9,38.6,35.1,35.8,40.5,39.9,35.4,36.1,37.8,39.6,37.8,35,34.4,34.7,34.2,35.3,36.2,38.4,38.5,35,34.2,35.9,36.6,36,34,32.1,32.6,32.7,36.1,36.5,36.1,36.3,33.9,32.2,34.3,34.7,32.5,32.4,32.1,31.3,31.6,31.8,31,32.8,32.6,32.2,34.5,34.2,32.6,35.8,33.6,32.5,30.6,29.9,32.1,30.7,28.5,29.5,28.9,28.5,29.4,28,28.1,29.7,28.6,30.4,32.2,33,33.6,33.8,32.9,32.9,31.6,29.9,29.2,29.7,30.4,28.2,29.6,28.6,30.1,31.2,32.4,30.1,27.9,27.7,27.9,29.3,28.7,26.5,25.8,24.9,23.9,25.3,25.5,25,25.8,29,29.8,30.9,31.5,31.5,25.1,23.2,23.3,24.9,24.2,23.4,21.1,23.3,23.5,24.7,26.3,22.7,20.5,19.3,19.6,19.7,20.2,20.9,20.9,21.2,21,21.7,21.5,22,22.1,21.3,22.4,22.8,20.9,20.2,20.7,21.8,21.7,20.6,19.2,20,20,19],"ndvi16Day":[0.15,0.158,null,0.143,0.157,0.158,0.164,0.153,0.14,0.139,0.145,0.144,0.145,0.157,0.154,0.147,0.162,0.154,0.145,0.152,0.152,0.192,0.156]}};
  const egyptCrops = [{"id":"wheat","nameEn":"Wheat (Qamh)","nameAr":"قمح","season":"Shitwi","months":[11,12,1,2,3,4],"family":"Poaceae","kc":1.15,"baseWaterMm":480,"heatThresholdC":32,"salinityToleranceDsm":6,"phMin":6,"phMax":8.5,"nitrogenScore":-2,"rootDepth":"medium","erosionProtection":65,"marketScore":85,"forageScore":40,"riskNote":"Confirm local supply silo delivery quotas and rust-resistant cultivar selection.","riskNoteAr":"تأكد من حصص توريد الصوامع واختيار صنف مقاوم للصدأ."},{"id":"berseem","nameEn":"Egyptian Clover (Berseem)","nameAr":"برسيم مصري","season":"Shitwi","months":[10,11,12,1,2,3,4],"family":"Fabaceae","kc":1.05,"baseWaterMm":560,"heatThresholdC":34,"salinityToleranceDsm":3.5,"phMin":6.5,"phMax":8.2,"nitrogenScore":3,"rootDepth":"deep","erosionProtection":95,"marketScore":75,"forageScore":100,"riskNote":"High biological nitrogen fixer; requires reliable early-autumn irrigation for establishment.","riskNoteAr":"يثبت النيتروجين حيوياً؛ يحتاج رياً منتظماً في بداية الخريف."},{"id":"faba_bean","nameEn":"Faba Bean (Foul Baladi)","nameAr":"فول بلدي","season":"Shitwi","months":[10,11,12,1,2,3],"family":"Fabaceae","kc":0.95,"baseWaterMm":340,"heatThresholdC":30,"salinityToleranceDsm":2.5,"phMin":6.5,"phMax":8,"nitrogenScore":2,"rootDepth":"medium","erosionProtection":75,"marketScore":88,"forageScore":50,"riskNote":"Inspect field history for broomrape (Orobanche) parasitic weed before planting.","riskNoteAr":"راجع تاريخ الإصابة بالهالوك قبل الزراعة."},{"id":"sugar_beet","nameEn":"Sugar Beet (Bangar El-Sokkar)","nameAr":"بنجر السكر","season":"Shitwi","months":[9,10,11,12,1,2,3],"family":"Amaranthaceae","kc":1.05,"baseWaterMm":430,"heatThresholdC":35,"salinityToleranceDsm":7,"phMin":6.5,"phMax":8.8,"nitrogenScore":-1,"rootDepth":"deep","erosionProtection":80,"marketScore":90,"forageScore":65,"riskNote":"Excellent for saline clays in Fayoum and North Delta; requires pre-season sugar factory contract.","riskNoteAr":"راجع ملاءمة التربة الملحية وعقد مصنع السكر قبل الموسم."},{"id":"maize","nameEn":"Summer Maize (Dura Shami)","nameAr":"ذرة شامية","season":"Seifi","months":[5,6,7,8,9],"family":"Poaceae","kc":1.2,"baseWaterMm":720,"heatThresholdC":36,"salinityToleranceDsm":1.8,"phMin":5.8,"phMax":8,"nitrogenScore":-3,"rootDepth":"medium","erosionProtection":60,"marketScore":85,"forageScore":85,"riskNote":"Vulnerable to tassel blasting above 38C in July and tail-end summer canal shortages.","riskNoteAr":"حساس للحرارة فوق ٣٨°م عند التزهير ونقص المياه في نهايات الترع."},{"id":"sorghum","nameEn":"Grain/Forage Sorghum (Dura Rafia)","nameAr":"ذرة رفيعة","season":"Seifi","months":[5,6,7,8,9],"family":"Poaceae","kc":0.9,"baseWaterMm":460,"heatThresholdC":42,"salinityToleranceDsm":6.8,"phMin":6,"phMax":8.8,"nitrogenScore":-1,"rootDepth":"deep","erosionProtection":85,"marketScore":76,"forageScore":90,"riskNote":"High drought and heat resilience for Fayoum tail-end canals; monitor bird damage near harvest.","riskNoteAr":"يتحمل الجفاف والحرارة؛ راقب أضرار الطيور قرب الحصاد."},{"id":"soybean","nameEn":"Soybean (Foul Soya)","nameAr":"فول صويا","season":"Seifi","months":[5,6,7,8,9],"family":"Fabaceae","kc":1,"baseWaterMm":520,"heatThresholdC":38,"salinityToleranceDsm":5,"phMin":6,"phMax":8.2,"nitrogenScore":2,"rootDepth":"medium","erosionProtection":80,"marketScore":92,"forageScore":70,"riskNote":"Requires Rhizobium seed inoculation in new or saline lands and cotton leafworm monitoring.","riskNoteAr":"يحتاج تلقيح البذور بالعقدين في الأراضي الجديدة ومراقبة دودة ورق القطن."},{"id":"sesame","nameEn":"Sesame (Semsem)","nameAr":"سمسم","season":"Seifi","months":[5,6,7,8],"family":"Pedaliaceae","kc":0.85,"baseWaterMm":390,"heatThresholdC":41,"salinityToleranceDsm":4,"phMin":6,"phMax":8.3,"nitrogenScore":0,"rootDepth":"deep","erosionProtection":70,"marketScore":89,"forageScore":30,"riskNote":"Low water demand and deep taproot; sensitive to waterlogging in poorly drained heavy clay.","riskNoteAr":"احتياجه المائي منخفض؛ حساس للتغدق وسوء الصرف في الطين الثقيل."},{"id":"cowpea_nili","nameEn":"Nili Cowpea / Short Cover (Lubia)","nameAr":"لوبيا نيلي / غطاء حيوي","season":"Nili","months":[9,10,11],"family":"Fabaceae","kc":0.8,"baseWaterMm":240,"heatThresholdC":40,"salinityToleranceDsm":4.9,"phMin":5.5,"phMax":8.5,"nitrogenScore":2,"rootDepth":"medium","erosionProtection":90,"marketScore":78,"forageScore":85,"riskNote":"Closes the autumn bare-soil window between summer harvest and late winter wheat sowing.","riskNoteAr":"راجع موعد الزراعة ومدة الصنف لتغطية فجوة الخريف دون تأخير المحصول الشتوي."}];
  const evidence = {"schemaVersion":1,"auditDate":"2026-11-13","description":"Authoritative FAO crop reference values mapped to nine existing catalog records. Reference values do not validate the current prototype scoring or irrigation estimates.","sources":{"fao56_1998_table12":{"organization":"Food and Agriculture Organization of the United Nations","title":"FAO Irrigation and Drainage Paper 56 (1998), Chapter 6, Table 12: single crop coefficients","url":"https://www.fao.org/4/x0490e/x0490e0b.htm","verified":"Directly inspected official HTML table","note":"Stage values are planning references; Kc_ini depends on wetting; some Kc_mid/Kc_end selections from published ranges remain assumptions."},"fao_salinity_annex_a1_1":{"organization":"Food and Agriculture Organization of the United Nations","title":"Agricultural Drainage Water Management in Arid and Semi-arid Areas, Annex 1, Table A1.1: crop salt tolerance","url":"https://www.fao.org/4/y4263e/y4263e0e.htm","verified":"Directly inspected official HTML table","note":"Outcome-specific ECe thresholds and yield slopes; cultivar, soil and life stage change outcomes."},"fao56_2025_pending":{"organization":"Food and Agriculture Organization of the United Nations","title":"Crop Evapotranspiration, second edition revised 2025","url":"https://doi.org/10.4060/cd6621en","verified":"Publication exists; numeric crop-by-crop values NOT independently verified in this audit","note":"Do not relabel the 1998 numbers as 2025 values until cross-checking the revised tables."},"egypt_arc_pending":{"organization":"Egypt Agricultural Research Center","title":"National crop extension bulletins","url":"https://www.arc.sci.eg/","verified":"Candidate for future crop-calendar/cultivar validation; no Egypt-specific dates assigned in this catalog"}},"cropProfiles":{"wheat":{"scientificName":"Triticum aestivum","cropCoefficient":{"status":"published_reference","kcIni":0.7,"kcMid":1.15,"kcEnd":0.25,"units":"dimensionless","sourceId":"fao56_1998_table12","basis":"winter wheat non-frozen soil; end 0.25–0.40 depending harvest","referenceNotes":"Kc_end is a selected endpoint of a published range, not an Egypt-specific measurement."},"salinity":{"status":"published_reference","eceThresholdDsm":6,"slopePctPerDsm":7.1,"outcome":"grain yield","rating":"MT","sourceId":"fao_salinity_annex_a1_1","note":"ECe = laboratory saturated-paste root-zone soil electrical conductivity, NOT soil pH, canal EC or the prototype 0–100 screening index."},"unverifiedLegacyFields":["kc","baseWaterMm","heatThresholdC","salinityToleranceDsm","phMin","phMax","nitrogenScore","rootDepth","erosionProtection","marketScore","forageScore","months"],"status":"reference_with_uncalibrated_demo_fields","reviewRequirements":["Egypt cultivar and agricultural calendar","field-calibrated water balance","observed soil ECe for salinity","agronomic review of crop nitrogen/market/forage/heat/pH indices"]},"berseem":{"scientificName":"Trifolium alexandrinum","cropCoefficient":{"status":"published_reference","kcIni":0.4,"kcMid":0.9,"kcEnd":0.85,"units":"dimensionless","sourceId":"fao56_1998_table12","basis":"clover hay berseem averaged cutting effects, not an individual cutting","referenceNotes":"Reference conditions are non-stressed, well managed, subhumid; adjust for Egyptian climate/irrigation."},"salinity":{"status":"published_reference","eceThresholdDsm":1.5,"slopePctPerDsm":5.7,"outcome":"shoot dry weight","rating":"MS","sourceId":"fao_salinity_annex_a1_1","note":"ECe = laboratory saturated-paste root-zone soil electrical conductivity, NOT soil pH, canal EC or the prototype 0–100 screening index."},"unverifiedLegacyFields":["kc","baseWaterMm","heatThresholdC","salinityToleranceDsm","phMin","phMax","nitrogenScore","rootDepth","erosionProtection","marketScore","forageScore","months"],"status":"reference_with_uncalibrated_demo_fields","reviewRequirements":["Egypt cultivar and agricultural calendar","field-calibrated water balance","observed soil ECe for salinity","agronomic review of crop nitrogen/market/forage/heat/pH indices"]},"faba_bean":{"scientificName":"Vicia faba","cropCoefficient":{"status":"published_reference","kcIni":0.5,"kcMid":1.15,"kcEnd":0.3,"units":"dimensionless","sourceId":"fao56_1998_table12","basis":"faba/broad bean dry seed, not fresh bean; salinity study used shoot dry weight","referenceNotes":"Reference conditions are non-stressed, well managed, subhumid; adjust for Egyptian climate/irrigation."},"salinity":{"status":"reference_for_different_outcome","eceThresholdDsm":1.6,"slopePctPerDsm":9.6,"outcome":"shoot dry weight","rating":"MS","sourceId":"fao_salinity_annex_a1_1","note":"FAO endpoint is shoot dry weight; this is not identical to the catalog's dry-seed harvest outcome. Display only; do not penalize automatically."},"unverifiedLegacyFields":["kc","baseWaterMm","heatThresholdC","salinityToleranceDsm","phMin","phMax","nitrogenScore","rootDepth","erosionProtection","marketScore","forageScore","months"],"status":"reference_with_uncalibrated_demo_fields","reviewRequirements":["Egypt cultivar and agricultural calendar","field-calibrated water balance","observed soil ECe for salinity","agronomic review of crop nitrogen/market/forage/heat/pH indices"]},"sugar_beet":{"scientificName":"Beta vulgaris","cropCoefficient":{"status":"published_reference","kcIni":0.35,"kcMid":1.2,"kcEnd":0.7,"units":"dimensionless","sourceId":"fao56_1998_table12","basis":"sugar beet root crop","referenceNotes":"Reference conditions are non-stressed, well managed, subhumid; adjust for Egyptian climate/irrigation."},"salinity":{"status":"published_reference","eceThresholdDsm":7,"slopePctPerDsm":5.9,"outcome":"storage root yield","rating":"T","sourceId":"fao_salinity_annex_a1_1","note":"ECe = laboratory saturated-paste root-zone soil electrical conductivity, NOT soil pH, canal EC or the prototype 0–100 screening index."},"unverifiedLegacyFields":["kc","baseWaterMm","heatThresholdC","salinityToleranceDsm","phMin","phMax","nitrogenScore","rootDepth","erosionProtection","marketScore","forageScore","months"],"status":"reference_with_uncalibrated_demo_fields","reviewRequirements":["Egypt cultivar and agricultural calendar","field-calibrated water balance","observed soil ECe for salinity","agronomic review of crop nitrogen/market/forage/heat/pH indices"]},"maize":{"scientificName":"Zea mays","cropCoefficient":{"status":"published_reference","kcIni":0.3,"kcMid":1.2,"kcEnd":0.35,"units":"dimensionless","sourceId":"fao56_1998_table12","basis":"field maize grain; late Kc 0.35–0.60 depends harvest, 0.35 assumes drying","referenceNotes":"Kc_end is a selected endpoint of a published range, not an Egypt-specific measurement."},"salinity":{"status":"reference_for_different_outcome","eceThresholdDsm":1.7,"slopePctPerDsm":12,"outcome":"ear fresh weight","rating":"MS","sourceId":"fao_salinity_annex_a1_1","note":"FAO endpoint is ear fresh weight; this is not identical to the catalog's grain-corn harvest outcome. Display only; do not penalize automatically."},"unverifiedLegacyFields":["kc","baseWaterMm","heatThresholdC","salinityToleranceDsm","phMin","phMax","nitrogenScore","rootDepth","erosionProtection","marketScore","forageScore","months"],"status":"reference_with_uncalibrated_demo_fields","reviewRequirements":["Egypt cultivar and agricultural calendar","field-calibrated water balance","observed soil ECe for salinity","agronomic review of crop nitrogen/market/forage/heat/pH indices"]},"sorghum":{"scientificName":"Sorghum bicolor","cropCoefficient":{"status":"published_reference","kcIni":0.3,"kcMid":1.05,"kcEnd":0.55,"units":"dimensionless","sourceId":"fao56_1998_table12","basis":"grain sorghum; Kc_mid 1.00–1.10, selected 1.05 is midpoint assumption","referenceNotes":"Kc_mid=1.05 is a selectable midpoint of a reported 1.00–1.10 range, not an exact published point."},"salinity":{"status":"published_reference","eceThresholdDsm":6.8,"slopePctPerDsm":16,"outcome":"grain yield","rating":"MT","sourceId":"fao_salinity_annex_a1_1","note":"ECe = laboratory saturated-paste root-zone soil electrical conductivity, NOT soil pH, canal EC or the prototype 0–100 screening index."},"unverifiedLegacyFields":["kc","baseWaterMm","heatThresholdC","salinityToleranceDsm","phMin","phMax","nitrogenScore","rootDepth","erosionProtection","marketScore","forageScore","months"],"status":"reference_with_uncalibrated_demo_fields","reviewRequirements":["Egypt cultivar and agricultural calendar","field-calibrated water balance","observed soil ECe for salinity","agronomic review of crop nitrogen/market/forage/heat/pH indices"]},"soybean":{"scientificName":"Glycine max","cropCoefficient":{"status":"published_reference","kcIni":0.4,"kcMid":1.15,"kcEnd":0.5,"units":"dimensionless","sourceId":"fao56_1998_table12","basis":"soybean seed crop","referenceNotes":"Reference conditions are non-stressed, well managed, subhumid; adjust for Egyptian climate/irrigation."},"salinity":{"status":"published_reference","eceThresholdDsm":5,"slopePctPerDsm":20,"outcome":"seed yield","rating":"MT","sourceId":"fao_salinity_annex_a1_1","note":"ECe = laboratory saturated-paste root-zone soil electrical conductivity, NOT soil pH, canal EC or the prototype 0–100 screening index."},"unverifiedLegacyFields":["kc","baseWaterMm","heatThresholdC","salinityToleranceDsm","phMin","phMax","nitrogenScore","rootDepth","erosionProtection","marketScore","forageScore","months"],"status":"reference_with_uncalibrated_demo_fields","reviewRequirements":["Egypt cultivar and agricultural calendar","field-calibrated water balance","observed soil ECe for salinity","agronomic review of crop nitrogen/market/forage/heat/pH indices"]},"sesame":{"scientificName":"Sesamum indicum","cropCoefficient":{"status":"published_reference","kcIni":0.35,"kcMid":1.1,"kcEnd":0.25,"units":"dimensionless","sourceId":"fao56_1998_table12","basis":"FAO salinity qualitative S only; no numerical threshold or slope","referenceNotes":"Reference conditions are non-stressed, well managed, subhumid; adjust for Egyptian climate/irrigation."},"salinity":{"status":"qualitative_only","eceThresholdDsm":null,"slopePctPerDsm":null,"outcome":"pod dry weight","rating":"S","sourceId":"fao_salinity_annex_a1_1","note":"The FAO table has only a qualitative sensitive rating; numeric ECe is unknown."},"unverifiedLegacyFields":["kc","baseWaterMm","heatThresholdC","salinityToleranceDsm","phMin","phMax","nitrogenScore","rootDepth","erosionProtection","marketScore","forageScore","months"],"status":"reference_with_uncalibrated_demo_fields","reviewRequirements":["Egypt cultivar and agricultural calendar","field-calibrated water balance","observed soil ECe for salinity","agronomic review of crop nitrogen/market/forage/heat/pH indices"]},"cowpea_nili":{"scientificName":"Vigna unguiculata","cropCoefficient":{"status":"not_validated_for_use","kcIni":null,"kcMid":null,"kcEnd":null,"units":"dimensionless","sourceId":"fao56_1998_table12","basis":"FAO Kc is for full-season green gram/cowpea crop, not verified for short Nili cover; salinity is forage proxy only","referenceNotes":"FAO generic cowpea coefficients cannot be assigned to a short-duration Nili cover without local stage/cutting data."},"salinity":{"status":"reference_for_different_outcome","eceThresholdDsm":2.5,"slopePctPerDsm":11,"outcome":"shoot dry weight","rating":"MS","sourceId":"fao_salinity_annex_a1_1","note":"Forage shoot dry weight, not Nili cover success; do not use for crop suitability penalty."},"unverifiedLegacyFields":["kc","baseWaterMm","heatThresholdC","salinityToleranceDsm","phMin","phMax","nitrogenScore","rootDepth","erosionProtection","marketScore","forageScore","months"],"status":"reference_with_uncalibrated_demo_fields","reviewRequirements":["Egypt cultivar and agricultural calendar","field-calibrated water balance","observed soil ECe for salinity","agronomic review of crop nitrogen/market/forage/heat/pH indices"]}},"globalCaveats":["The current engine still uses legacy baseWaterMm, kc and ordinal nitrogen/market/forage/heat assumptions; do not call its rankings FAO-validated.","FAO tabulated Kc coefficients need crop-stage dates and local climatic adjustments; no Egypt-specific calendar is inferred here.","Salt thresholds use laboratory measured soil ECe in dS/m, not the app's 0–100 screening proxy.","Do not convert qualitative sesame salinity into a numerical threshold.","Cowpea short-cover performance and forage salinity studies are not interchangeable."]};
  const egyptCropsCatalog = egyptCrops;

  // --- referenceEt.js ---
  const rad = (d) => (d * Math.PI) / 180;
const saturation = (t) => 0.6108 * Math.exp((17.27 * t) / (t + 237.3));
const finite = (n) => typeof n === "number" && Number.isFinite(n);
const clip = (n, a, b) => Math.max(a, Math.min(b, n));
// FAO-56 daily short-grass Penman–Monteith, G=0. RHmean approximation for ea.
// This derives ET0 from meteorological drivers, never from EVPTRNS.
function dailyReferenceEt(row, latitude, elevation) {
  const bounds = {
    tmax: [-90, 65],
    tmin: [-90, 60],
    rh: [0, 100],
    wind: [0, 50],
    solar: [0, 50],
    pressure: [70, 110],
  };
  if (
    !finite(latitude) ||
    Math.abs(latitude) >= 66 ||
    !finite(elevation) ||
    elevation < -500 ||
    elevation > 9000
  )
    return null;
  for (const [key, [low, high]] of Object.entries(bounds))
    if (!finite(row[key]) || row[key] < low || row[key] > high) return null;
  if (row.tmax < row.tmin || !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) return null;
  const stamp = Date.parse(row.date);
  if (
    !Number.isFinite(stamp) ||
    new Date(stamp).toISOString().slice(0, 10) !== row.date
  )
    return null;
  const rowYear = Number(row.date.slice(0, 4));
  const day = (stamp - Date.UTC(rowYear, 0, 1)) / 86400000 + 1;
  const phi = rad(latitude),
    distance = 1 + 0.033 * Math.cos((2 * Math.PI * day) / 365),
    declination = 0.409 * Math.sin((2 * Math.PI * day) / 365 - 1.39);
  const sunset = Math.acos(clip(-Math.tan(phi) * Math.tan(declination), -1, 1));
  const extraterrestrial =
    ((24 * 60) / Math.PI) *
    0.082 *
    distance *
    (sunset * Math.sin(phi) * Math.sin(declination) +
      Math.cos(phi) * Math.cos(declination) * Math.sin(sunset));
  const clearSky = (0.75 + 2e-5 * elevation) * extraterrestrial;
  if (clearSky <= 0) return null;
  const mean = (row.tmax + row.tmin) / 2,
    es = (saturation(row.tmax) + saturation(row.tmin)) / 2,
    ea = (es * row.rh) / 100;
  const netShort = 0.77 * row.solar;
  const netLong =
    ((4.903e-9 * ((row.tmax + 273.16) ** 4 + (row.tmin + 273.16) ** 4)) / 2) *
    (0.34 - 0.14 * Math.sqrt(ea)) *
    (1.35 * clip(row.solar / clearSky, 0.3, 1) - 0.35);
  const delta = (4098 * saturation(mean)) / (mean + 237.3) ** 2,
    gamma = 0.000665 * row.pressure;
  const value =
    (0.408 * delta * (netShort - netLong) +
      ((gamma * 900) / (mean + 273)) * row.wind * (es - ea)) /
    (delta + gamma * (1 + 0.34 * row.wind));
  return Number.isFinite(value) ? Math.max(0, value) : null;
}
const cache = new WeakMap();
function computeReferenceEt(drivers) {
  if (!drivers?.daily)
    return {
      value: null,
      status: "unavailable",
      unit: "mm",
      reason:
        "Requires radiation, humidity, 2 m wind, pressure and temperatures; EVPTRNS is energy flux.",
    };
  if (cache.has(drivers)) return cache.get(drivers);
  const daily = drivers.daily.map((p) => ({
    date: p.date,
    et0: dailyReferenceEt(p, drivers.lat, drivers.elevationM),
  }));
  const dates = new Set(daily.map((p) => p.date));
  const inferredYear =
    drivers.daily?.[0]?.date ? Number(drivers.daily[0].date.slice(0, 4)) : null;
  const expectedDays =
    inferredYear
      ? (Date.UTC(inferredYear + 1, 0, 1) - Date.UTC(inferredYear, 0, 1)) / 86400000
      : 365;
  const complete =
    dates.size === expectedDays &&
    daily.length === expectedDays &&
    daily.every((p) => p.et0 !== null);
  const windows = {
    Shitwi: [11, 12, 1, 2, 3, 4],
    Seifi: [5, 6, 7, 8, 9],
    Nili: [9, 10, 11],
  };
  const seasonal = Object.fromEntries(
    Object.entries(windows).map(([name, months]) => {
      const rows = daily.filter((p) =>
        months.includes(Number(p.date.slice(5, 7))),
      );
      const accepted = rows.filter((p) => p.et0 !== null);
      return [
        name,
        {
          sum: complete
            ? Number(accepted.reduce((s, p) => s + p.et0, 0).toFixed(2))
            : null,
          unit: "mm",
          validDays: accepted.length,
          expectedDays: { Shitwi: 181, Seifi: 153, Nili: 91 }[name],
        },
      ];
    }),
  );
  const result = {
    value: complete
      ? Number(daily.reduce((s, p) => s + p.et0, 0).toFixed(2))
      : null,
    status: complete ? "modeled" : "unavailable",
    unit: "mm",
    source: drivers.source,
    method:
      "FAO-56 daily short-grass Penman–Monteith; G=0; mean RH approximation; solar/clear-sky ratio clamped 0.3–1; negative ET floored at zero.",
    seasonal,
    validDays: daily.filter((p) => p.et0 !== null).length,
    reason:
      `Regional modeled reference ET, not measured crop water. Winter is Jan–Apr+Nov–Dec${inferredYear ? ` ${inferredYear}` : ""}; Nili windows overlap. This does not calibrate catalog water demand.`,
  };
  cache.set(drivers, result);
  return result;
}


  // --- cropEvidence.js ---
  

const CROP_REFERENCE_SOURCES = evidence.sources;
function getCropEvidence(cropId) {
  return evidence.cropProfiles[cropId] ?? null;
}

/**
 * FAO ECe (saturated-paste soil extract), never the app's 0–100 salinity screening score.
 * Returns an illustrative reference response, NOT a calibrated yield prediction.
 */
function assessMeasuredSalinity(cropId, measuredEceDsm) {
  const profile = getCropEvidence(cropId);
  if (measuredEceDsm === null || measuredEceDsm === undefined || measuredEceDsm === "") {
    return { status: "unavailable", reason: "A laboratory soil ECe measurement is required." };
  }
  if (typeof measuredEceDsm !== "number" || !Number.isFinite(measuredEceDsm) || measuredEceDsm < 0 || measuredEceDsm > 100) {
    return { status: "invalid", reason: "ECe must be a finite value in dS/m between 0 and 100." };
  }
  const ref = profile?.salinity;
  if (!ref || ref.status !== "published_reference" || ref.eceThresholdDsm === null || ref.slopePctPerDsm === null) {
    return { status: "unsupported", reason: ref?.note ?? "No matching FAO numeric ECe response." };
  }
  const excessDsm = Math.max(0, measuredEceDsm - ref.eceThresholdDsm);
  return {
    status: excessDsm > 0 ? "above_reference_threshold" : "within_reference_threshold",
    measuredEceDsm, thresholdDsm: ref.eceThresholdDsm, slopePctPerDsm: ref.slopePctPerDsm,
    excessDsm, outcome: ref.outcome, sourceId: ref.sourceId,
    illustrativeRelativeYieldPct: Math.max(0, Math.round((100 - ref.slopePctPerDsm * excessDsm) * 10) / 10),
    caveat: "FAO reference response for the stated outcome, not a field-specific yield prediction or a salinity measurement."
  };
}

/**
 * Crop ETc from daily FAO-56 ET0 and a full, explicitly specified crop calendar.
 * Does not calculate effective rainfall, irrigation scheduling or gross water withdrawals.
 * Missing dates / stage lengths / matching reference coefficients return unavailable, never fabricated values.
 */
function projectCropEtc(cropId, { drivers, sowingDate, stageLengthsDays } = {}) {
  const profile = getCropEvidence(cropId);
  const kc = profile?.cropCoefficient;
  if (!kc || kc.status !== "published_reference" || [kc.kcIni, kc.kcMid, kc.kcEnd].some((v) => !Number.isFinite(v))) {
    return { status: "unavailable", reason: "Crop-stage Kc has not been verified for this crop's use." };
  }
  if (!Array.isArray(stageLengthsDays) || stageLengthsDays.length !== 4 || !stageLengthsDays.every((v) => Number.isInteger(v) && v > 0)) {
    return { status: "unavailable", reason: "Explicit positive initial/development/mid/late stage lengths are required." };
  }
  if (!/^\d{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])$/.test(sowingDate ?? "")) {
    return { status: "unavailable", reason: "An explicit planting date (YYYY-MM-DD) is required to use the reference weather." };
  }
  const start = Date.parse(sowingDate);
  if (!Number.isFinite(start) || new Date(start).toISOString().slice(0, 10) !== sowingDate || !drivers?.daily) {
    return { status: "unavailable", reason: "Invalid planting date or missing reference ET weather." };
  }
  const byDate = new Map(drivers.daily.map((row) => [row.date, row]));
  const [ini, dev, mid, late] = stageLengthsDays;
  const total = ini + dev + mid + late;
  if (total > 365) return { status: "unavailable", reason: "Stage lengths exceed one year." };
  let sum = 0;
  for (let i = 0; i < total; i++) {
    const date = new Date(start + 86400000 * i).toISOString().slice(0, 10);
    const row = byDate.get(date);
    if (!row) return { status: "unavailable", reason: "Complete daily weather is missing for the specified crop window." };
    const et0 = dailyReferenceEt(row, drivers.lat, drivers.elevationM);
    if (!Number.isFinite(et0)) return { status: "unavailable", reason: "A required ET0 driver is missing or invalid." };
    let currentKc;
    if (i < ini) currentKc = kc.kcIni;
    else if (i < ini + dev) currentKc = kc.kcIni + (kc.kcMid - kc.kcIni) * ((i - ini + 1) / dev);
    else if (i < ini + dev + mid) currentKc = kc.kcMid;
    else currentKc = kc.kcMid + (kc.kcEnd - kc.kcMid) * ((i - ini - dev - mid + 1) / late);
    sum += et0 * currentKc;
  }
  return {
    status: "reference_scenario", cropId, sowingDate, stageLengthsDays,
    etcMm: Math.round(sum * 100) / 100, unit: "mm/crop-cycle",
    referenceSourceId: kc.sourceId, et0Method: "FAO-56",
    caveat: "Reference ETc (not gross irrigation demand or measured water). Calendar/cultivar/wetting adjustments and effective rainfall are not validated."
  };
}

/**
 * Returns crop-level evidence structured into the 5 NASA Strategy Explanation elements.
 */
function explainCropDecisionEvidence(cropId, { measuredEceDsm = null, heatStressDays = 0 } = {}) {
  const profile = getCropEvidence(cropId);
  const salt = assessMeasuredSalinity(cropId, measuredEceDsm);

  return {
    cropId,
    whySuggested: {
      en: profile?.agronomicRoleEn ?? "Adapted crop candidate for target seasonal window.",
      ar: profile?.agronomicRoleAr ?? "محصول مناسب للعروة الزراعية المستهدفة.",
    },
    supportingEvidence: {
      en: `FAO salinity threshold ${profile?.salinity?.eceThresholdDsm ?? "N/A"} dS/m; Summer heat tolerance rating: ${heatStressDays > 14 ? "High heat exposure area" : "Moderate heat exposure area"}.`,
      ar: `حد الملوحة المرجعي من الفاو ${profile?.salinity?.eceThresholdDsm ?? "غير متاح"} ديسيسيمنز/م؛ التعرض للإجهاد الحراري: ${heatStressDays > 14 ? "منطقة معرضة لموجات حر شديدة" : "منطقة معتدلة الإجهاد الحراري"}.`,
      salinityStatus: salt.status,
    },
    expectedBenefits: {
      en: profile?.benefitsEn ?? "Contributes to rotational water efficiency or soil fertility enhancement.",
      ar: profile?.benefitsAr ?? "يساهم في ترشيد المياه أو تحسين خصوبة التربة وتوازن النيتروجين.",
    },
    informationGaps: {
      en: "Requires laboratory soil test for ECe and on-site pest inspection.",
      ar: "يتطلب تحليلاً معملياً لملوحة التربة ECe وفحصاً ميدانياً لخلو الأرض من النيماتودا والآفات.",
    },
    risksLocalReview: {
      en: "Confirm certified seed variety availability and district water rotation schedule with local agricultural extension.",
      ar: "راجع الجمعية الزراعية أو المهندس المحلي للتأكد من توافر التقاوي ومناوبات الترعة.",
      decisionSupportDisclaimer: "Advisory decision support only — not a substitute for local agronomist consultation.",
    },
  };
}


  // --- fieldIndices.js ---
  
const valid = (n) => typeof n === "number" && Number.isFinite(n);
const DAY = 86400000;
const clamp = (n, low, high) => Math.max(low, Math.min(high, n));

function computeFieldIndices(data, inputs, catalog) {
  // Derive the data year from the payload; fall back to last complete calendar year.
  const year =
    data.year ??
    (Number(data.climateDaily?.[0]?.date?.slice(0, 4)) ||
      new Date().getUTCFullYear() - 1);
  const seasons = {
    Shitwi: [11, 12, 1, 2, 3, 4],
    Seifi: [5, 6, 7, 8, 9],
    Nili: [9, 10, 11],
  };
  const daily = data.climateDaily ?? [];
  const seasonalEnergy = Object.fromEntries(
    Object.entries(seasons).map(([season, months]) => {
      const points = daily.filter((p) =>
        months.includes(Number(p.date.slice(5, 7))),
      );
      const values = points
        .map((p) => p.evapotranspiration)
        .filter((v) => valid(v) && v > -900);
      return [
        season,
        {
          sum: values.length
            ? Number(values.reduce((a, b) => a + b, 0).toFixed(6))
            : null,
          validDays: values.length,
          expectedDays: { Shitwi: 181, Seifi: 153, Nili: 91 }[season],
          unit: "MJ/m²",
          window:
            season === "Shitwi"
              ? `Jan–Apr + Nov–Dec ${year} (calendar-year proxy, not a continuous crop season)`
              : season === "Seifi"
                ? `May–Sep ${year}`
                : `Sep–Nov ${year} (overlaps other windows)`,
        },
      ];
    }),
  );
  const summer = daily.filter(
    (p) =>
      Number(p.date.slice(5, 7)) >= 5 &&
      Number(p.date.slice(5, 7)) <= 9 &&
      valid(p.tmax) &&
      p.tmax > -900,
  );
  const temps = daily.length
    ? summer.map((p) => p.tmax)
    : (data.summerMaxTemps ?? []).filter((v) => valid(v) && v > -900);
  const heatStressDays = temps.filter((t) => t > 38).length;
  const julyHeatDays = summer.filter(
    (p) => p.date.slice(5, 7) === "07" && p.tmax > 38,
  ).length;
  const points = [...(data.ndviSeries ?? [])].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const runs = [];
  let run = null;
  let observed = 0;
  const seen = new Set();
  for (const p of points) {
    if (seen.has(p.date)) throw new Error("Duplicate NDVI composite date");
    seen.add(p.date);
    const start = Date.parse(p.date);
    const from = Math.max(start, Date.UTC(year, 8, 1));
    const to = Math.min(start + 16 * DAY, Date.UTC(year, 11, 1));
    if (!Number.isFinite(start) || to <= from) continue;
    const usable = valid(p.ndvi) && p.ndvi >= -0.2 && p.ndvi <= 1;
    if (usable) observed += (to - from) / DAY;
    if (!usable || p.ndvi >= 0.22) {
      run = null;
      continue;
    }
    if (run && run.endMs === from) {
      run.endMs = to;
      run.days += (to - from) / DAY;
      run.composites++;
    } else {
      run = {
        startMs: from,
        endMs: to,
        days: (to - from) / DAY,
        composites: 1,
      };
      runs.push(run);
    }
  }
  const bareSoilRuns = runs.map((r) => ({
    start: new Date(r.startMs).toISOString().slice(0, 10),
    end: new Date(r.endMs).toISOString().slice(0, 10),
    days: r.days,
    composites: r.composites,
  }));
  const bareSoilDays = Math.max(0, ...runs.map((r) => r.days));

  // Detailed Bare-Field & Vulnerability Windows analysis across the year
  const allBareRuns = [];
  let currentBare = null;
  for (const p of points) {
    const start = Date.parse(p.date);
    const usable = valid(p.ndvi) && p.ndvi >= -0.2 && p.ndvi <= 1;
    const isBare = usable && p.ndvi < 0.22;
    const to = start + 16 * DAY;
    if (isBare) {
      if (currentBare && currentBare.endMs === start) {
        currentBare.endMs = to;
        currentBare.days += 16;
        currentBare.composites++;
        currentBare.minNdvi = Math.min(currentBare.minNdvi, p.ndvi);
      } else {
        currentBare = {
          startMs: start,
          endMs: to,
          days: 16,
          composites: 1,
          minNdvi: p.ndvi,
        };
        allBareRuns.push(currentBare);
      }
    } else {
      currentBare = null;
    }
  }

  const vulnerabilityRuns = allBareRuns.map((r) => {
    const startDate = new Date(r.startMs).toISOString().slice(0, 10);
    const endDate = new Date(r.endMs).toISOString().slice(0, 10);
    const windowDaily = daily.filter((d) => d.date >= startDate && d.date <= endDate);
    const tmaxs = windowDaily.map((d) => d.tmax).filter((v) => valid(v) && v > -900);
    const maxTempC = tmaxs.length ? Math.max(...tmaxs) : null;
    const avgTempC = tmaxs.length ? Math.round((tmaxs.reduce((a, b) => a + b, 0) / tmaxs.length) * 10) / 10 : null;
    const startMonth = Number(startDate.slice(5, 7));

    const isAutumn = startMonth >= 7 && startMonth <= 10;
    const isSpringSummer = startMonth >= 3 && startMonth <= 6;

    const recommendedCoverCrops = isAutumn
      ? [
          {
            id: "berseem_fahl",
            nameEn: "Berseem Fahl (Catch Clover)",
            nameAr: "برسيم فحل (عروة سريعة)",
            durationDays: 65,
            benefitEn: "Rapid single-cut forage; fixes atmospheric nitrogen (30–45 kg N/fed) and protects soil surface from wind erosion before wheat.",
            benefitAr: "حشة واحدة سريعة (٦٠–٧٠ يوماً)؛ يثبت ٣٠–٤٥ كجم نيتروجين/فدان ويحمي التربة من الإشعاع والرياح قبل القمح.",
          },
          {
            id: "cowpea_nili",
            nameEn: "Nili Forage Cowpea",
            nameAr: "لوبيا علف نيلية",
            durationDays: 70,
            benefitEn: "High heat and drought tolerance; establishes dense vegetative cover to suppress weeds and reduce soil moisture loss.",
            benefitAr: "تحمل فائق للحرارة والجفاف؛ غطاء ورقي كثيف يكتم الحشائش ويقلل تبخر رطوبة التربة.",
          },
        ]
      : isSpringSummer
      ? [
          {
            id: "sorghum_cover",
            nameEn: "Short-cycle Forage Sorghum",
            nameAr: "سورجم علف قصير",
            durationDays: 55,
            benefitEn: "Tolerates high summer temperatures, absorbs residual salinity, and prevents solar baking of the topsoil.",
            benefitAr: "يتحمل القيظ الشديد ويمتص الأملاح السطحية ويمنع تشقق وتصلب التربة في الصيف.",
          },
        ]
      : [
          {
            id: "tillage_radish",
            nameEn: "Catch Legume / Cover Crop",
            nameAr: "محصول تغطية بقولي",
            durationDays: 60,
            benefitEn: "Short-duration ground cover to prevent nutrient leaching and maintain active root microbiome.",
            benefitAr: "تغطية سريعة للأرض تمنع غسيل العناصر الغذائية وتحافظ على حيوية الميكروبيوم في التربة.",
          },
        ];

    const isHighThermalStress = (maxTempC ?? 0) >= 36;
    const severity = r.days >= 32 && isHighThermalStress ? "severe" : r.days >= 20 ? "moderate" : "low";

    return {
      startDate,
      endDate,
      days: r.days,
      composites: r.composites,
      minNdvi: Math.round(r.minNdvi * 1000) / 1000,
      maxTempC,
      avgTempC,
      severity,
      riskEn: `${r.days} days bare-soil exposure (NDVI < 0.22)${maxTempC ? ` with peak temperatures up to ${maxTempC}°C` : ""}; prone to wind erosion, organic matter breakdown, and rapid moisture depletion.`,
      riskAr: `${r.days} يوماً من انكشاف التربة (NDVI أقل من ٠.٢٢)${maxTempC ? ` مع حرارة عظمى وصلت لـ ${maxTempC}°م` : ""}؛ مما يعرض الأرض للتآكل الهوائي وتفكك المادة العضوية وفقدان الرطوبة السريع.`,
      recommendedCoverCrops,
    };
  });

  const maxConsecutiveBareDays = Math.max(0, ...allBareRuns.map((r) => r.days));
  const hasSevereVulnerability = vulnerabilityRuns.some((v) => v.severity === "severe");
  const overallVulnerabilityLevel = hasSevereVulnerability ? "severe" : maxConsecutiveBareDays >= 20 ? "moderate" : "low";

  const bareFieldVulnerability = {
    detected: allBareRuns.length > 0 && maxConsecutiveBareDays >= 16,
    totalBareDays: allBareRuns.reduce((sum, r) => sum + r.days, 0),
    maxConsecutiveBareDays,
    overallLevel: overallVulnerabilityLevel,
    runs: vulnerabilityRuns,
    summaryEn: maxConsecutiveBareDays >= 20
      ? `Detected ${maxConsecutiveBareDays}-day bare-soil window. Soil is exposed to thermal degradation and erosion. Introducing a short-duration cover crop (Berseem Fahl or Cowpea) is strongly recommended.`
      : "Field maintains acceptable canopy coverage throughout the seasonal transitions.",
    summaryAr: maxConsecutiveBareDays >= 20
      ? `تم رصد نافذة انكشاف للتربة مدتها ${maxConsecutiveBareDays} يوماً. الأرض معرضة لفقدان الرطوبة والتآكل. نوصي بشدة بزراعة محصول تغطية سريع (برسيم فحل أو لوبيا علف).`
      : "الأرض تحتفظ بغطاء نباتي كافٍ طوال فترات التعاقب الزراعي.",
  };
  const summerNdvi = points.filter(
    (p) =>
      p.date.slice(5, 7) >= "05" &&
      p.date.slice(5, 7) <= "09" &&
      valid(p.ndvi) &&
      p.ndvi >= -0.2 &&
      p.ndvi <= 1,
  );
  const peakSummerNdvi = summerNdvi.length
    ? Math.max(...summerNdvi.map((p) => p.ndvi))
    : null;
  const baselineYearsSeen = new Set();
  const baseline = (data.ndviHistory?.years ?? []).filter((y) => {
    if (
      !y.accepted ||
      y.year < year - 5 ||
      y.year >= year ||
      !valid(y.peak) ||
      baselineYearsSeen.has(y.year)
    )
      return false;
    baselineYearsSeen.add(y.year);
    return true;
  });
  let anomaly = {
    value: null,
    status: "unavailable",
    reason:
      "At least three accepted historical same-pixel summers and eight current summer composites are required.",
    baselineYears: baseline.map((y) => y.year),
    peakSummerNdvi,
  };
  if (baseline.length >= 3 && summerNdvi.length >= 8 && valid(peakSummerNdvi)) {
    const mean = baseline.reduce((s, y) => s + y.peak, 0) / baseline.length;
    const sd = Math.sqrt(
      baseline.reduce((s, y) => s + (y.peak - mean) ** 2, 0) /
        (baseline.length - 1),
    );
    anomaly = {
      ...anomaly,
      mean,
      standardDeviation: sd,
      value: sd > 1e-8 ? (peakSummerNdvi - mean) / sd : null,
      status: sd > 1e-8 ? "available" : "unavailable",
      reason:
        sd > 1e-8
          ? "Small-sample peak anomaly; negative values do not establish water or heat stress."
          : "Historical variability is zero; z-score undefined.",
    };
  }
  const ph = data.soil?.phh2o;
  const clay = data.soil?.clay;
  const salinityRisk =
    valid(ph) && valid(clay)
      ? Math.round(
          clamp(
            15 +
              Math.max(0, ph - 8) * 35 +
              (clay > 40 ? 15 : 0) +
              (inputs.canalPosition === "tail" ? 12 : 0) +
              ({ none: 0, moderate: 18, high: 35 }[inputs.salinityLevel] ?? 0),
            0,
            100,
          ),
        )
      : null;
  const current = [inputs.currentWinterId, inputs.currentSummerId].map((id) =>
    catalog.find((c) => c.id === id),
  );
  const baselineNitrogen = current.every(Boolean)
    ? current.reduce((sum, c) => sum + c.nitrogenScore, 0)
    : null;
  const measuredSoil = data.sources?.soil?.kind === "observed";
  // Soil concentrations are reported alongside the ordinal balance; no calibrated conversion exists.
  const nitrogen = {
    cropBalance: baselineNitrogen,
    soilNitrogenGkg: measuredSoil ? (data.soil?.nitrogen ?? null) : null,
    soilOrganicCarbonGkg: measuredSoil ? (data.soil?.soc ?? null) : null,
    adjustedValue: null,
    reason:
      "Concentrations in g/kg cannot calibrate an ordinal crop index without a validated response model.",
    lowCarbonContext:
      measuredSoil && valid(data.soil?.soc) ? data.soil.soc < 10 : null,
  };
  return {
    seasonalEnergy,
    referenceEt0: computeReferenceEt(data.referenceEtDrivers),
    heatStressDays,
    julyHeatDays,
    summerObservationDays: temps.length,
    bareSoilDays,
    bareSoilTotalDays: runs.reduce((s, r) => s + r.days, 0),
    bareSoilRuns,
    bareFieldVulnerability,
    autumnObservedDays: Math.min(91, observed),
    autumnMissingDays: Math.max(0, 91 - observed),
    canopyAnomaly: anomaly,
    salinityRisk,
    salinityStatus: measuredSoil
      ? "screening"
      : "illustrative: synthetic soil fallback",
    nitrogen,
    soilOrganicCarbon: data.soil?.soc ?? null,
    rootZoneWetnessAvg: data.avgRootWetness ?? null,
  };
}


  // --- strategyExplanations.js ---
  function explainStrategy(strategy, data, inputs, metrics) {
  const reasons = [];
  const add = (en, ar) => reasons.push({ en, ar });
  if (Object.values(data.sources ?? {}).some((s) => s.kind !== "observed"))
    add(
      "Low: at least one source is an illustrative fallback.",
      "منخفض: أحد المصادر على الأقل بديل توضيحي.",
    );
  if (inputs.landType === "new_sandy")
    add(
      "Desert-fringe land scenario: pixel mixing is possible, not detected or measured.",
      "سيناريو أرض على حافة الصحراء: اختلاط البكسل محتمل ولم يُقَس.",
    );
  if (metrics.summerObservationDays < 153)
    add(
      "Summer climate observations are incomplete.",
      "أرصاد المناخ الصيفية غير مكتملة.",
    );
  if (metrics.autumnMissingDays > 0)
    add(
      `${metrics.autumnMissingDays} autumn days lack accepted NDVI support.`,
      `${metrics.autumnMissingDays} يوم خريفي دون رصد NDVI مقبول.`,
    );
  if (metrics.canopyAnomaly?.value === null)
    add(
      "Historical canopy anomaly is unavailable.",
      "شذوذ الغطاء النباتي التاريخي غير متاح.",
    );
  if (strategy.conditionalNili)
    add(
      "Nili crop dates are conditional and need local scheduling.",
      "مواعيد الغطاء النيلي مشروطة وتحتاج تخطيطاً محلياً.",
    );
  const confidence = Object.values(data.sources ?? {}).some(
    (s) => s.kind !== "observed",
  )
    ? "low"
    : reasons.length
      ? "medium"
      : "high";
  const ndviSource =
    data.sources?.ndvi?.kind === "observed"
      ? "MODIS NDVI (250m composite)"
      : "Illustrative NDVI fixture";
  const ndviSourceAr =
    data.sources?.ndvi?.kind === "observed"
      ? "أقمار MODIS NDVI (دقة ٢٥٠م)"
      : "بيانات NDVI توضيحية";
  const source =
    data.sources?.climate?.kind === "observed"
      ? "NASA POWER (Agroclimatology)"
      : "Illustrative climate fixture";
  const sourceAr =
    data.sources?.climate?.kind === "observed"
      ? "ناسا POWER للمناخ الزراعي"
      : "بيانات مناخ توضيحية";

  const summer = strategy.crops.find((c) => c.season === "Seifi") || strategy.crops[0];
  const winter = strategy.crops.find((c) => c.season === "Shitwi") || strategy.crops[0];
  const cover = strategy.crops.find((c) => c.season === "Nili");

  // 1. Why it was suggested (سبب الاختيار)
  const isWaterSmart = strategy.id.includes("water") || strategy.badge.toLowerCase().includes("water");
  const isSoilBuilder = strategy.id.includes("soil") || strategy.badge.toLowerCase().includes("soil");

  let whySuggestedEn = "";
  let whySuggestedAr = "";

  if (isWaterSmart) {
    whySuggestedEn = `Selected to minimize seasonal evapotranspiration under thermal stress. Alternating drought-hardy summer crops (${summer?.nameEn ?? "Sorghum"}) with winter staple (${winter?.nameEn ?? "Wheat"}) moderates gross irrigation demand while keeping productive canopy coverage during extreme heat events.`;
    whySuggestedAr = `تم اختيار هذه الدورة لتقليل الفاقد التبخري تحت الإجهاد الحراري. التبديل بمحصول صيفي متأقلم مع الجفاف والحرارة (${summer?.nameAr ?? "ذرة رفيعة"}) مع المحصول الشتوي (${winter?.nameAr ?? "قمح"}) يقلل استهلاك المياه الكلي مع ضمان استمرار الغطاء النباتي في موجات القيظ.`;
  } else if (isSoilBuilder) {
    whySuggestedEn = `Designed for biological nitrogen fixation and soil organic restoration. Introducing legumes (${winter?.nameEn ?? "Berseem"} / ${cover?.nameEn ?? "Cowpea"}) enriches residual nitrogen following exhaustive cereals, breaks nematode/pathogen life cycles, and guards against salinity-induced nutrient lockout.`;
    whySuggestedAr = `صُممت لتعزيز تثبيت النيتروجين الحيوي واستعادة خصوبة التربة. إدخال البقوليات (${winter?.nameAr ?? "برسيم"} / ${cover?.nameAr ?? "لوبيا"}) يثري مخزون النيتروجين العضوي بعد الحبوب المجهدة، ويكسر دورات الآفات وأمراض التربة، ويحد من أضرار تراكم الأملاح.`;
  } else {
    whySuggestedEn = `Baseline crop sequence representing the conventional rotation (${winter?.nameEn ?? "Wheat"} followed by ${summer?.nameEn ?? "Maize"}). Serves as the benchmark for water demand, soil nutrient balance, and exposure to summer heatwaves.`;
    whySuggestedAr = `الدورة الزراعية المعتادة (${winter?.nameAr ?? "قمح"} متبوعاً بـ ${summer?.nameAr ?? "ذرة شامية"}). تُستخدم كنقطة مقارنة مرجعية لحساب استهلاك المياه، وتوازن النيتروجين، ومدى التعرض لموجات الحر.`;
  }

  // 2. Supporting Evidence (الدليل من بيانات ناسا)
  const supportingEvidenceEn = `${source}: Detected ${metrics.heatStressDays} days with maximum temperatures > 38°C in May–September (${metrics.julyHeatDays ?? 0} days in July). ${ndviSource}: Identified autumn bare-soil / low-cover duration of ${metrics.bareSoilDays} days (${metrics.autumnMissingDays ?? 0} days unobserved). Modeled summer heat threshold: ${summer?.heatThresholdC ?? 38}°C.`;
  const supportingEvidenceAr = `${sourceAr}: تم رصد ${metrics.heatStressDays} يوماً تجاوزت فيها الحرارة العظمى ٣٨°م من مايو إلى سبتمبر (${metrics.julyHeatDays ?? 0} يوماً في يوليو). ${ndviSourceAr}: رصد فترة انكشاف وانخفاض غطاء خريفي لمدة ${metrics.bareSoilDays} يوماً (${metrics.autumnMissingDays ?? 0} يوماً دون رصد). حد التحمل الحراري في الدليل: ${summer?.heatThresholdC ?? 38}°م.`;

  // 3. Expected Benefits (الفوائد المتوقعة)
  const waterSavedTextEn = strategy.waterSavedM3Feddan > 0
    ? `Saves ~${strategy.waterSavedM3Feddan} m³/feddan (${strategy.waterSavedPercent}%) compared to baseline`
    : "Maintains standard seasonal irrigation baseline";
  const waterSavedTextAr = strategy.waterSavedM3Feddan > 0
    ? `توفير حوالي ${strategy.waterSavedM3Feddan} م³/فدان (${strategy.waterSavedPercent}%) مقارنة بالدورة الحالية`
    : "تحافظ على معدل الري المعتاد للمقارنة";

  const expectedBenefitsEn = `${waterSavedTextEn}. Net soil nitrogen score: ${strategy.nitrogenBalance > 0 ? "+" : ""}${strategy.nitrogenBalance}. Reduces bare-soil exposure by providing green canopy cover, breaking monoculture pest cycles, and conserving root-zone soil moisture.`;
  const expectedBenefitsAr = `${waterSavedTextAr}. مؤشر النيتروجين المقدر: ${strategy.nitrogenBalance > 0 ? "+" : ""}${strategy.nitrogenBalance}. حماية التربة من الانكشاف والتصحر بزيادة الغطاء النباتي، كسر دورة توطن الآفات، والحفاظ على رطوبة التربة الحيوية.`;

  // 4. Information Gaps (فجوات البيانات)
  const informationGapsEn = "Orbital observations cannot detect: (1) Saturated-paste root-zone salinity (ECe) at depth — a laboratory soil extract is required; (2) Hyper-local pest, nematode, or root-rot presence in the field; (3) Daily farmgate market price variations across Egyptian governorates; (4) Sub-plot canal siltation or drainage micro-variations.";
  const informationGapsAr = "ما لا يراه القمر الصناعي (فجوات البيانات): (١) قياس ملوحة التربة المعملية الدقيقة (ECe) على عمق الجذور — يلزم فحص معملي أرضي؛ (٢) انتشار الآفات أو النيماتودا أو أعفان الجذور الموضعية في الحقل؛ (٣) التغيرات اليومية لأسعار بيع المحاصيل في أسواق المحافظة؛ (٤) انسداد المراوي أو تفاوت الصرف الزراعي داخل القطعة.";

  // 5. Risks requiring local review (المخاطر والتنبيه الإرشادي)
  const risksLocalReviewEn = "Risks requiring agronomist & farmer review: (1) Verify local cultivar maturity period to prevent date conflicts between summer harvest and winter sowing; (2) Confirm availability of certified seed and local canal rotation turns. ADVISORY NOTICE: FieldShift / Sky Space is an orbital decision-support aid to guide agronomic planning and is NOT a substitute for on-site agronomist consultation and farmer local field experience.";
  const risksLocalReviewAr = "المخاطر التي تتطلب مراجعة محلية: (١) التأكد من دورة نضج الأصناف المتاحة لتفادي تداخل مواعيد حصاد الصيفي وزراعة الشتوي؛ (٢) التأكد من توافر التقاوي المعتمدة ومناوبات الري المحلية. تنبيه إرشادي إلزامي: هذا النظام أداة دعم قرار استرشادية تعتمد على الأقمار الصناعية والنماذج البيئية، وليست بديلاً عن المعاينة الميدانية للمهندس الزراعي وخبرة المزارع الميدانية.";

  return {
    why: {
      en: `${whySuggestedEn} ${supportingEvidenceEn}`,
      ar: `${whySuggestedAr} ${supportingEvidenceAr}`,
    },
    // The 5 mandatory NASA Strategy Explanation schema elements:
    whySuggested: {
      en: whySuggestedEn,
      ar: whySuggestedAr,
    },
    supportingEvidence: {
      en: supportingEvidenceEn,
      ar: supportingEvidenceAr,
      metrics: {
        heatStressDays: metrics.heatStressDays,
        julyHeatDays: metrics.julyHeatDays ?? 0,
        bareSoilDays: metrics.bareSoilDays,
        salinityRisk: metrics.salinityRisk,
        nitrogenBalance: strategy.nitrogenBalance,
        grossWaterM3Feddan: strategy.grossWaterM3Feddan,
      },
    },
    expectedBenefits: {
      en: expectedBenefitsEn,
      ar: expectedBenefitsAr,
      waterSavedM3Feddan: strategy.waterSavedM3Feddan ?? 0,
      waterSavedPercent: strategy.waterSavedPercent ?? 0,
      nitrogenBalance: strategy.nitrogenBalance,
    },
    informationGaps: {
      en: informationGapsEn,
      ar: informationGapsAr,
      unseenFactors: [
        "Root-zone laboratory ECe at depth",
        "Local daily market farmgate prices",
        "Localized pest / fungal / nematode pressure",
        "Micro-topographical canal drainage",
      ],
    },
    risksLocalReview: {
      en: risksLocalReviewEn,
      ar: risksLocalReviewAr,
      requiresAgronomist: true,
      advisoryNotice: {
        en: "FieldShift / Sky Space is a decision-support aid, not a substitute for farmer experience or on-site agronomist consultation.",
        ar: "هذا النظام أداة دعم قرار استرشادية، وليست بديلاً عن خبرة المزارع أو المعاينة الميدانية للمهندس الزراعي.",
      },
    },
    confidence,
    confidenceReasons: reasons,
    confidenceMeaning: {
      en: "Heuristic data-support category, not a calibrated probability, field accuracy or agronomic approval.",
      ar: "فئة إرشادية لدعم البيانات وليست احتمالاً معايراً أو دقة حقلية أو اعتماداً زراعياً.",
    },
    checklist: strategy.crops.map((c) => ({
      en: c.riskNote,
      ar: c.riskNoteAr,
    })),
  };
}


  // --- rotationEngine.js ---
  



/* clamp reused */
const isNumber = (n) => typeof n === "number" && Number.isFinite(n);

function evaluateFieldAndRotations(nasaData, userInputs, cropsCatalog) {
  const {
    landType,
    irrigationType,
    canalPosition,
    salinityLevel,
    currentWinterId,
    currentSummerId,
    hasLivestock,
    weights,
  } = userInputs;
  const feddans =
    Number(userInputs.feddans) + Number(userInputs.qirats ?? 0) / 24;
  if (!Number.isFinite(feddans) || feddans <= 0)
    throw new Error("Enter a positive field area.");
  const ece = userInputs.soilEceDsm;
  if (
    ece !== null &&
    ece !== undefined &&
    (typeof ece !== "number" || !Number.isFinite(ece) || ece < 0 || ece > 100)
  )
    throw new Error("Measured soil ECe must be 0–100 dS/m, or left blank.");
  const winter = cropsCatalog.find(
    (c) => c.id === currentWinterId && c.season === "Shitwi",
  );
  const summer = cropsCatalog.find(
    (c) => c.id === currentSummerId && c.season === "Seifi",
  );
  if (!winter || !summer)
    throw new Error("Select valid winter and summer crops.");
  const eta =
    { flood: 0.55, modified_surface: 0.68, sprinkler: 0.75, drip: 0.88 }[
      irrigationType
    ] ?? 0.55;
  const diagnostics = computeFieldIndices(nasaData, userInputs, cropsCatalog);
  const { bareSoilDays, salinityRisk } = diagnostics;
  const soilPh = nasaData.soil?.phh2o ?? 8;

  // Scenario Modifiers (What-If Simulation)
  const scenarioModifiers = {
    tempDeltaC: Number(userInputs.scenarioModifiers?.tempDeltaC ?? userInputs.tempDeltaC ?? 0),
    waterSupplyPctDelta: Number(userInputs.scenarioModifiers?.waterSupplyPctDelta ?? userInputs.waterSupplyPctDelta ?? 0),
  };
  const tempMultiplier = Math.max(0.6, 1 + scenarioModifiers.tempDeltaC * 0.045);
  const waterAvailabilityFactor = Math.max(0.3, 1 + scenarioModifiers.waterSupplyPctDelta / 100);

  // Compute effective heat stress days under scenario temperature shift
  const dailyTemps = (nasaData.climateDaily ?? [])
    .filter((p) => Number(p.date.slice(5, 7)) >= 5 && Number(p.date.slice(5, 7)) <= 9 && isNumber(p.tmax))
    .map((p) => p.tmax + scenarioModifiers.tempDeltaC);
  const effectiveHeatStressDays = dailyTemps.length
    ? dailyTemps.filter((t) => t > 38).length
    : Math.max(0, diagnostics.heatStressDays + Math.round(scenarioModifiers.tempDeltaC * 4));

  const simulationDiagnostics = {
    ...diagnostics,
    heatStressDays: effectiveHeatStressDays,
  };

  const normalizedWeights = Object.fromEntries(
    ["water", "soil", "market"].map((k) => [
      k,
      clamp(Number(weights?.[k]) || 0, 0, 100),
    ]),
  );
  if (!Object.values(normalizedWeights).some(Boolean))
    Object.assign(normalizedWeights, { water: 50, soil: 30, market: 20 });

  function scoreSequence(
    id,
    labelEn,
    labelAr,
    badge,
    cropIds,
    scoringWeights = normalizedWeights,
  ) {
    const crops = cropIds.map((cropId) =>
      cropsCatalog.find((c) => c.id === cropId),
    );
    if (crops.some((c) => !c)) throw new Error("Crop catalog is incomplete.");
    const rawWaterMm = crops.reduce((sum, c) => sum + c.baseWaterMm * tempMultiplier * c.kc, 0);
    const grossWaterM3Feddan = Math.round((rawWaterMm * 4.2) / eta);
    const nitrogenBalance = crops.reduce((sum, c) => sum + c.nitrogenScore, 0);

    const effectiveWaterStress = grossWaterM3Feddan / waterAvailabilityFactor;
    const waterScore = clamp(
      Math.round(100 - (effectiveWaterStress - 2600) / 38),
      5,
      98,
    );
    const soilScore = clamp(
      Math.round(
        55 +
          nitrogenBalance * 12 +
          (crops.length === 3 ? 15 : 0) -
          (nitrogenBalance <= -3 ? 20 : 0),
      ),
      15,
      98,
    );
    const marketForageScore = Math.round(
      crops.reduce(
        (sum, c) =>
          sum +
          (hasLivestock
            ? c.forageScore * 0.6 + c.marketScore * 0.4
            : c.marketScore),
        0,
      ) / crops.length,
    );
    let penalty = nitrogenBalance <= -3 ? 18 : 0;
    const warnings = [];
    const addWarning = (en, ar) => warnings.push({ en, ar });
    if (nitrogenBalance <= -3)
      addWarning(
        "Consecutive cereals deplete the modeled nitrogen index.",
        "تعاقب الحبوب يخفض مؤشر النيتروجين في النموذج.",
      );
    const families = [
      ...[currentWinterId, currentSummerId].map(
        (id) => cropsCatalog.find((c) => c.id === id)?.family,
      ),
      ...crops.map((c) => c.family),
    ];
    if (
      families.some(
        (f, i) =>
          i >= 2 &&
          f === "Poaceae" &&
          families[i - 1] === f &&
          families[i - 2] === f,
      )
    ) {
      penalty += 18;
      addWarning(
        "Three or more consecutive cereals across the known history and proposed sequence; include a broadleaf break.",
        "ثلاثة محاصيل حبوب متتالية أو أكثر عبر التاريخ والدورة المقترحة؛ أضف محصولاً عريض الأوراق.",
      );
    }
    for (const c of crops) {
      const salt = assessMeasuredSalinity(c.id, ece);
      if (salt.status === "above_reference_threshold") {
        penalty += 15;
        addWarning(
          `${c.nameEn}: measured soil ECe ${salt.measuredEceDsm} dS/m exceeds the FAO reference ${salt.thresholdDsm} dS/m for ${salt.outcome}; verify locally.`,
          `${c.nameAr}: ملوحة التربة المقاسة ECe (${salt.measuredEceDsm}) تتجاوز مرجع FAO (${salt.thresholdDsm})؛ يلزم التحقق محلياً.`,
        );
      } else if (
        salt.status === "unsupported" &&
        ece !== null &&
        ece !== undefined
      ) {
        addWarning(
          `${c.nameEn}: no outcome-matched quantitative FAO salinity response; no numerical salinity penalty.`,
          `${c.nameAr}: لا يوجد مرجع FAO رقمي مطابق لغرض المحصول؛ لا تُخصم نقاط للملوحة.`,
        );
      }
      if (
        effectiveHeatStressDays > 14 &&
        c.season === "Seifi" &&
        c.heatThresholdC < (37 + scenarioModifiers.tempDeltaC * 0.4)
      ) {
        const heatPenalty = scenarioModifiers.tempDeltaC > 0 ? 15 : 12;
        penalty += heatPenalty;
        addWarning(
          `${c.nameEn}: summer heat exposure under climate scenario (${effectiveHeatStressDays} days > 38°C).`,
          `${c.nameAr}: تعرض للإجهاد الحراري صيفاً ضمن السيناريو المناخي (${effectiveHeatStressDays} يوماً فوق ٣٨°م).`,
        );
      }
      if (soilPh < c.phMin || soilPh > c.phMax)
        addWarning(
          `${c.nameEn}: pH outside catalog range; local review needed.`,
          `${c.nameAr}: الأس الهيدروجيني خارج نطاق الدليل؛ يلزم تقييم محلي.`,
        );
    }
    if (waterAvailabilityFactor < 0.85 && grossWaterM3Feddan > 3100) {
      const quotaPenalty = Math.round((1 - waterAvailabilityFactor) * 25);
      penalty += quotaPenalty;
      addWarning(
        `Water deficit risk: rotation water demand exceeds reduced quota (${scenarioModifiers.waterSupplyPctDelta}%).`,
        `خطر عجز مائي: استهلاك الدورة يتجاوز الحصة المائية المخفضة (${scenarioModifiers.waterSupplyPctDelta}%).`,
      );
    }
    if (salinityRisk > 65 && (ece === null || ece === undefined))
      addWarning(
        "Salinity screening is elevated, but soil ECe is not measured: no numeric salinity penalty; request a soil test.",
        "مؤشر الملوحة التقديري مرتفع، لكن ECe غير مقاس؛ لا عقوبة رقمية قبل تحليل التربة.",
      );
    if (
      landType === "new_sandy" &&
      ["flood", "modified_surface"].includes(irrigationType)
    )
      addWarning(
        "Sandy land with surface irrigation: verify infiltration losses and system design.",
        "تربة رملية مع ري سطحي: راجع فاقد التسرب وتصميم النظام.",
      );
    if (crops.length === 3)
      addWarning(
        "Nili cover is conditional: confirm early summer harvest and winter sowing dates. Catalog windows overlap; this is not a verified planting calendar. Avoid repeating Fabaceae without a pest review.",
        "الغطاء النيلي مشروط بحصاد صيفي مبكر وموعد الشتوي؛ الفترات متداخلة وليست جدولاً زراعياً معتمداً. راجع مخاطر تكرار البقوليات.",
      );
    const totalWeight = Object.values(scoringWeights).reduce(
      (a, b) => a + b,
      0,
    );
    const rawComposite =
      (scoringWeights.water * waterScore +
        scoringWeights.soil * soilScore +
        scoringWeights.market * marketForageScore) /
      totalWeight;
    return {
      id,
      labelEn,
      labelAr,
      badge,
      scoringWeights,
      sequenceKey: cropIds.join("/"),
      conditionalNili: crops.length === 3,
      crops,
      grossWaterM3Feddan,
      waterModelStatus: "prototype_uncalibrated",
      waterModelNote:
        "Legacy baseWaterMm × legacy Kc / assumed irrigation efficiency; not FAO-verified ETc or measured irrigation water.",
      totalFarmWaterM3: Math.round(grossWaterM3Feddan * feddans),
      nitrogenBalance,
      waterScore,
      soilScore,
      marketForageScore,
      finalSuitability: clamp(Math.round(rawComposite - penalty), 10, 99),
      penalty,
      warnings,
      verificationChecklist: crops.map((c) => c.riskNote),
    };
  }
  const baseline = scoreSequence(
    "baseline",
    "Current baseline",
    "الدورة الحالية",
    "Baseline",
    [currentWinterId, currentSummerId],
  );
  const pitchCounterfactual = scoreSequence(
    "counterfactual",
    "Illustrative summer switch + conditional cover",
    "تبديل صيفي توضيحي مع غطاء مشروط",
    "Counterfactual",
    [currentWinterId, "sorghum", "cowpea_nili"],
  );
  const search = generateCandidateRotations(
    cropsCatalog,
    diagnostics,
    userInputs,
  );
  const waterWeights = {
    ...normalizedWeights,
    water: Math.max(...Object.values(normalizedWeights)) + 50,
  };
  const soilWeights = {
    ...normalizedWeights,
    soil: Math.max(...Object.values(normalizedWeights)) + 50,
  };
  const scoreCandidates = (objective, objectiveWeights) =>
    search.candidates
      .map((ids, i) =>
        scoreSequence(
          `${objective}-${i}`,
          "",
          "",
          objective,
          ids,
          objectiveWeights,
        ),
      )
      .sort(
        (a, b) =>
          b.finalSuitability - a.finalSuitability ||
          (objective === "water"
            ? a.grossWaterM3Feddan - b.grossWaterM3Feddan
            : b.nitrogenBalance - a.nitrogenBalance) ||
          a.sequenceKey.localeCompare(b.sequenceKey),
      );
  const waterRanked = scoreCandidates("water", waterWeights);
  const soilRanked = scoreCandidates("soil", soilWeights);
  const choose = (ranked, excluded) =>
    ranked.find((c) => !excluded.includes(c.sequenceKey)) ?? null;
  const waterChoice = choose(waterRanked, [baseline.sequenceKey]);
  const soilChoice = choose(soilRanked, [
    baseline.sequenceKey,
    waterChoice?.sequenceKey,
  ]);
  const asCard = (choice, id, en, ar, badge) =>
    choice
      ? {
          ...scoreSequence(
            id,
            en,
            ar,
            badge,
            choice.crops.map((c) => c.id),
            normalizedWeights,
          ),
          objectiveSuitability: choice.finalSuitability,
          objectiveWeights: choice.scoringWeights,
        }
      : null;
  const waterSmart = asCard(
    waterChoice,
    "water",
    "Water-smart & heat-resilient",
    "ترشيد المياه وتحمل الحرارة",
    "Water scarcity",
  );
  const soilBuilder = asCard(
    soilChoice,
    "soil",
    "Soil recovery & salinity adaptation",
    "تعافي التربة والتكيف مع الملوحة",
    "Soil & nitrogen",
  );
  const strategies = [baseline, waterSmart, soilBuilder]
    .filter(Boolean)
    .map((s) => ({
      ...s,
      waterSavedM3Feddan: baseline.grossWaterM3Feddan - s.grossWaterM3Feddan,
      waterSavedPercent: Math.round(
        (1 - s.grossWaterM3Feddan / baseline.grossWaterM3Feddan) * 100,
      ),
      explanation: explainStrategy(s, nasaData, userInputs, simulationDiagnostics),
    }));
  // Clamped/rounded scores can tie (especially flood-irrigated water scores).
  // Resolve ties using the dominant farmer priority's underlying indicator.
  const dominantPriority = Object.keys(normalizedWeights).sort(
    (a, b) => normalizedWeights[b] - normalizedWeights[a],
  )[0];
  const tieBreak = (a, b) =>
    dominantPriority === "water"
      ? a.grossWaterM3Feddan - b.grossWaterM3Feddan
      : dominantPriority === "soil"
        ? b.nitrogenBalance - a.nitrogenBalance
        : b.marketForageScore - a.marketForageScore;
  const ranked = [...strategies].sort(
    (a, b) =>
      b.finalSuitability - a.finalSuitability ||
      tieBreak(a, b) ||
      a.id.localeCompare(b.id),
  );
  strategies.forEach((s) => {
    s.rank = ranked.findIndex((r) => r.id === s.id) + 1;
  });
  return {
    diagnostics: simulationDiagnostics,
    scenarioSimulation: {
      applied: scenarioModifiers.tempDeltaC !== 0 || scenarioModifiers.waterSupplyPctDelta !== 0,
      tempDeltaC: scenarioModifiers.tempDeltaC,
      waterSupplyPctDelta: scenarioModifiers.waterSupplyPctDelta,
      effectiveHeatStressDays,
      waterAvailabilityFactor,
    },
    pitchCounterfactual: {
      ...pitchCounterfactual,
      waterSavedM3Feddan:
        baseline.grossWaterM3Feddan - pitchCounterfactual.grossWaterM3Feddan,
      status: "hypothetical, not the selected recommendation",
    },
    candidateAudit: {
      ...search,
      candidates: undefined,
      waterWeights,
      soilWeights,
      waterRanking: waterRanked.map((c) => ({
        sequence: c.sequenceKey,
        score: c.finalSuitability,
        water: c.grossWaterM3Feddan,
        penalty: c.penalty,
      })),
      soilRanking: soilRanked.map((c) => ({
        sequence: c.sequenceKey,
        score: c.finalSuitability,
        nitrogen: c.nitrogenBalance,
        penalty: c.penalty,
      })),
    },
    strategies,
    rankedStrategyIds: ranked.map((s) => s.id),
    effectiveWeights: normalizedWeights,
  };
}

function generateCandidateRotations(catalog, diagnostics, inputs) {
  const winter = catalog.filter((c) => c.season === "Shitwi");
  const summer = catalog.filter((c) => c.season === "Seifi");
  const covers = catalog.filter((c) => c.season === "Nili");
  const coverOptions = inputs.forceNiliCover ? covers : [null, ...covers];
  const candidates = [];
  const rejected = [];
  for (const w of winter)
    for (const s of summer)
      for (const n of coverOptions) {
        const crops = [w, s, n].filter(Boolean);
        const ids = crops.map((c) => c.id);
        const reasons = [];
        if (new Set(ids).size !== ids.length)
          reasons.push("Repeated crop identifier");
        if (
          crops.some(
            (c) =>
              !Number.isFinite(c.baseWaterMm) ||
              c.baseWaterMm <= 0 ||
              !Number.isFinite(c.kc) ||
              c.kc <= 0,
          )
        )
          reasons.push("Missing or invalid water traits");
        if (crops.some((c) => inputs.excludedCropIds?.includes(c.id)))
          reasons.push("Farmer-excluded crop");
        if (reasons.length) rejected.push({ ids, reasons });
        else candidates.push(ids);
      }
  return {
    generated: candidates.length + rejected.length,
    retained: candidates.length,
    rejected,
    coverRequired: Boolean(inputs.forceNiliCover),
    lowCoverExplorationSuggested: diagnostics.bareSoilDays > 32,
    candidates,
    calendarStatus:
      "Nili candidates are conditional, not hard-validated calendars; dates require local review.",
  };
}

function rankRotations(inputs, diagnosticsOrData, dataOrCatalog, optionalCatalog) {
  let data, catalog;
  if (diagnosticsOrData?.climateDaily || diagnosticsOrData?.sources) {
    data = diagnosticsOrData;
    catalog = dataOrCatalog ?? egyptCropsCatalog;
  } else if (dataOrCatalog?.climateDaily || dataOrCatalog?.sources) {
    data = dataOrCatalog;
    catalog = optionalCatalog ?? egyptCropsCatalog;
  } else {
    data = diagnosticsOrData;
    catalog = egyptCropsCatalog;
  }
  return evaluateFieldAndRotations(data, inputs, catalog);
}



  // --- nasaDataService.js ---
  
/**
 * FieldShift data service — live APIs first, compact fallback second.
 *
 * Live sources (queried for the exact field centroid):
 *   • NASA POWER daily point API  → climate series + FAO-56 ET₀ drivers + elevation
 *   • ORNL DAAC MODIS MOD13Q1 API → 16-day NDVI (QA screened) for the data year
 *                                   and the 5 previous summers (canopy-anomaly baseline)
 *   • ISRIC SoilGrids 2.0 API     → topsoil clay / sand / SOC / nitrogen / pH
 *
 * The data year is always the last complete calendar year (see targetDataYear).
 * If an API fails or times out, that source falls back to src/data/fallbackPresets.json
 * (regional monthly means) and is labelled kind: "synthetic" so the engine/UI can warn.
 */

const REQUEST_TIMEOUT_MS = 25000;
const CACHE_VERSION = "fieldshift-v3";
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // complete live result
const PARTIAL_CACHE_MAX_AGE = 60 * 60 * 1000; // some sources fell back → retry after 1 h
const _DAY = 86400000;
const HISTORY_YEARS = 5;
const MODIS_CONCURRENCY = 4;

const presets = Object.fromEntries(
  Object.entries(fallbackPresets).filter(([key]) => !key.startsWith("_")),
);

const validNumber = (value) =>
  typeof value === "number" && Number.isFinite(value);
const cleanPowerValue = (value) =>
  validNumber(value) && value > -900 ? value : null;
const mean = (values) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
const pad3 = (n) => String(n).padStart(3, "0");

/** Last complete calendar year. In Jan–Feb the previous December may not be final yet. */
function targetDataYear(now = new Date()) {
  const year = now.getUTCFullYear();
  return now.getUTCMonth() < 2 ? year - 2 : year - 1;
}
const daysInYear = (year) =>
  (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / _DAY;
const isoDate = (ms) => new Date(ms).toISOString().slice(0, 10);
const yearDates = (year) =>
  Array.from({ length: daysInYear(year) }, (_, i) =>
    isoDate(Date.UTC(year, 0, 1 + i)),
  );
/** MOD13Q1 composite start dates (DOY 1, 17, … 353) for a year. */
const modisCompositeDates = (year) =>
  Array.from({ length: 23 }, (_, i) => isoDate(Date.UTC(year, 0, 1 + i * 16)));

function nearestPreset(lat, lon) {
  // Great-circle distance, used only to choose a regional fallback, not to downscale data.
  const radians = (n) => (n * Math.PI) / 180;
  const distance = (p) =>
    Math.sin(radians(p.lat - lat) / 2) ** 2 +
    Math.cos(radians(lat)) *
      Math.cos(radians(p.lat)) *
      Math.sin(radians(p.lon - lon) / 2) ** 2;
  return Object.values(presets).reduce((best, p) =>
    distance(p) < distance(best) ? p : best,
  );
}

/** Expands the compact regional fallback into the daily/16-day shapes the engine expects. */
function expandFallback(preset, year = targetDataYear()) {
  const baseDates = yearDates(fallbackPresets._about?.baseYear ?? 2025);
  const tmaxByMonthDay = new Map(
    baseDates.map((d, i) => [d.slice(5), preset.tmaxDaily[i]]),
  );
  const climateDaily = yearDates(year).map((date) => {
    const monthDay = date.slice(5) === "02-29" ? "02-28" : date.slice(5);
    const monthly = preset.climateMonthly[Number(date.slice(5, 7)) - 1];
    return {
      date,
      tmax: tmaxByMonthDay.get(monthDay) ?? monthly.tmax,
      tmin: monthly.tmin,
      precipitation: monthly.precipitation,
      evapotranspiration: monthly.evapotranspiration,
      rootWetness: monthly.rootWetness,
      topWetness: monthly.topWetness,
    };
  });
  const summer = climateDaily.filter(
    (d) => d.date.slice(5, 7) >= "05" && d.date.slice(5, 7) <= "09",
  );
  return {
    soil: structuredClone(preset.soil),
    climateDaily,
    summerMaxTemps: summer.map((d) => d.tmax).filter(validNumber),
    avgRootWetness: mean(
      preset.climateMonthly.map((m) => m.rootWetness).filter(validNumber),
    ),
    ndviSeries: modisCompositeDates(year).map((date, i) => ({
      date,
      ndvi: preset.ndvi16Day[i] ?? null,
    })),
  };
}

function parsePower(
  payload,
  { requireComplete = false, year = targetDataYear(), lat, lon, url } = {},
) {
  const parameters = payload?.properties?.parameter;
  if (!parameters?.T2M_MAX) throw new Error("Missing POWER temperature series");
  const names = {
    tmax: "T2M_MAX",
    tmin: "T2M_MIN",
    precipitation: "PRECTOTCORR",
    evapotranspiration: "EVPTRNS",
    rootWetness: "GWETROOT",
    topWetness: "GWETTOP",
  };
  const driverNames = {
    rh: "RH2M",
    wind: "WS2M",
    solar: "ALLSKY_SFC_SW_DWN",
    pressure: "PS",
  };
  const bounds = {
    tmax: [-90, 65],
    tmin: [-90, 60],
    precipitation: [0, 500],
    evapotranspiration: [-50, 50],
    rootWetness: [0, 1],
    topWetness: [0, 1],
    rh: [0, 100],
    wind: [0, 50],
    solar: [0, 50],
    pressure: [70, 110],
  };
  if (requireComplete) {
    const units = {
      T2M_MAX: "C",
      T2M_MIN: "C",
      PRECTOTCORR: "mm/day",
      EVPTRNS: "MJ/m^2/day",
      GWETROOT: "1",
      GWETTOP: "1",
    };
    for (const [key, unit] of Object.entries(units))
      if (payload.parameters?.[key]?.units !== unit)
        throw new Error("Unrecognized POWER units");
  }
  const read = (key, name, d) => {
    const value = cleanPowerValue(parameters[name]?.[d]);
    const [low, high] = bounds[key];
    return value !== null && value >= low && value <= high ? value : null;
  };
  const yearPattern = new RegExp(`^${year}\\d{4}$`);
  const dates = [
    ...new Set(Object.values(parameters).flatMap((p) => Object.keys(p))),
  ]
    .filter((d) => yearPattern.test(d))
    .sort();
  const toIso = (d) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  const climateDaily = dates.map((d) => ({
    date: toIso(d),
    ...Object.fromEntries(
      Object.entries(names).map(([key, name]) => [key, read(key, name, d)]),
    ),
  }));
  const summer = climateDaily.filter(
    (d) => d.date.slice(5, 7) >= "05" && d.date.slice(5, 7) <= "09",
  );
  if (!summer.some((d) => d.tmax !== null))
    throw new Error("Missing POWER summer observations");
  if (
    climateDaily.some(
      (d) => d.tmax !== null && d.tmin !== null && d.tmax < d.tmin,
    )
  )
    throw new Error("POWER Tmax below Tmin");
  const expectedDays = daysInYear(year);
  if (
    requireComplete &&
    (dates.length !== expectedDays ||
      dates.some((d) => {
        const iso = toIso(d);
        return (
          !Number.isFinite(Date.parse(iso)) ||
          new Date(iso).toISOString().slice(0, 10) !== iso
        );
      }) ||
      summer.filter((d) => d.tmax !== null).length !== 153 ||
      Object.keys(names).some(
        (key) =>
          climateDaily.filter((d) => d[key] !== null).length <
          expectedDays - 18,
      ))
  )
    throw new Error(`Incomplete POWER coverage for ${year}; retaining fallback`);

  // FAO-56 drivers come from the same response; ET₀ stays "unavailable" if any are missing.
  const elevation = payload?.geometry?.coordinates?.[2];
  const hasDrivers = Object.values(driverNames).every(
    (name) => parameters[name],
  );
  const referenceEtDrivers =
    hasDrivers && validNumber(elevation)
      ? {
          lat: validNumber(lat) ? lat : payload.geometry.coordinates[1],
          lon: validNumber(lon) ? lon : payload.geometry.coordinates[0],
          elevationM: elevation,
          daily: dates.map((d) => ({
            date: toIso(d),
            tmax: read("tmax", "T2M_MAX", d),
            tmin: read("tmin", "T2M_MIN", d),
            ...Object.fromEntries(
              Object.entries(driverNames).map(([key, name]) => [
                key,
                read(key, name, d),
              ]),
            ),
          })),
          source: {
            provider: "NASA POWER",
            url,
            retrievedAt: new Date().toISOString(),
            units: {
              tmax: "C",
              tmin: "C",
              rh: "%",
              wind: "m/s",
              solar: "MJ/m^2/day",
              pressure: "kPa",
            },
          },
        }
      : null;
  return {
    climateDaily,
    summerMaxTemps: summer.map((d) => d.tmax).filter(validNumber),
    avgRootWetness: mean(
      climateDaily.map((d) => d.rootWetness).filter(validNumber),
    ),
    referenceEtDrivers,
  };
}

function parseIsric(payload) {
  const layers = payload?.properties?.layers;
  if (!Array.isArray(layers)) throw new Error("Missing SoilGrids layers");
  const soil = {};
  for (const [name, divisor] of Object.entries({
    clay: 10,
    sand: 10,
    soc: 10,
    nitrogen: 100,
    phh2o: 10,
  })) {
    const depths = layers.find((l) => l.name === name)?.depths ?? [];
    // Thickness-weighted top 15 cm: 0–5 cm (5), 5–15 cm (10).
    const selected = depths.filter((d) =>
      ["0-5cm", "5-15cm"].includes(d.label),
    );
    if (
      selected.length !== 2 ||
      selected.some((d) => !validNumber(d.values?.mean))
    )
      throw new Error("Incomplete SoilGrids profile");
    soil[name] =
      selected.reduce(
        (sum, d) => sum + d.values.mean * (d.label === "0-5cm" ? 5 : 10),
        0,
      ) /
      15 /
      divisor;
  }
  return validateSoil(soil);
}

function validateSoil(soil) {
  for (const name of ["clay", "sand", "soc", "nitrogen", "phh2o"])
    if (!validNumber(soil?.[name]))
      throw new Error(`Missing soil property: ${name}`);
  if (
    soil.phh2o <= 0 ||
    soil.phh2o > 14 ||
    soil.clay < 0 ||
    soil.clay > 100 ||
    soil.sand < 0 ||
    soil.sand > 100 ||
    soil.soc < 0 ||
    soil.nitrogen < 0 ||
    soil.sand + soil.clay <= 0 ||
    soil.sand + soil.clay > 100
  )
    throw new Error("Invalid soil units");
  return soil;
}

function parseModis(payload, qualityPayload, year = targetDataYear()) {
  if (!qualityPayload?.subset?.length)
    throw new Error("MODIS pixel reliability is required");
  const qa = new Map(
    qualityPayload.subset.map((row) => [row.calendar_date, row]),
  );
  const seen = new Set();
  const datePattern = new RegExp(`^${year}-\\d{2}-\\d{2}$`);
  const series = (payload?.subset ?? [])
    .map((entry) => {
      if (!datePattern.test(entry.calendar_date) || seen.has(entry.calendar_date))
        throw new Error("Duplicate/invalid MODIS date");
      seen.add(entry.calendar_date);
      const quality = qa.get(entry.calendar_date);
      if (
        !quality ||
        quality.data.length !== entry.data.length ||
        quality.tile !== entry.tile
      )
        throw new Error("MODIS QA alignment mismatch");
      const pixels = entry.data.filter(
        (value, i) =>
          validNumber(value) &&
          value >= -2000 &&
          value <= 10000 &&
          quality.data[i] === 0,
      );
      return {
        date: entry.calendar_date,
        ndvi: pixels.length ? mean(pixels) * 0.0001 : null,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!series.some((p) => p.ndvi !== null))
    throw new Error("No good-quality MODIS pixels");
  return series;
}

function harmonizationMeta(lat, lon, year = targetDataYear()) {
  return {
    centroid: { lat, lon },
    climateResolution: "~50 km",
    vegetationResolution: "250 m",
    soilResolution: "250 m",
    period: `${year}-01-01/${year}-12-31`,
    method:
      "Centroid co-location of NASA POWER climate vectors (T2M_MAX, EVPTRNS, GWETROOT), MODIS reflectance and SoilGrids properties; no field-scale downscaling or physical data assimilation.",
  };
}

// ---------------------------------------------------------------------------
// Caching: in-memory (works on the Node backend and in the browser) + localStorage.
// ---------------------------------------------------------------------------
const memoryCache = new Map();
const inFlight = new Map();

function cacheKey(lat, lon, year) {
  return `${CACHE_VERSION}:${year}:${lat.toFixed(4)},${lon.toFixed(4)}`;
}
const allObserved = (data) =>
  ["climate", "soil", "ndvi"].every(
    (key) => data?.sources?.[key]?.kind === "observed",
  );
function isFresh(entry) {
  if (!entry?.data?.sources) return false;
  const maxAge = allObserved(entry.data) ? CACHE_MAX_AGE : PARTIAL_CACHE_MAX_AGE;
  return Date.now() - entry.savedAt <= maxAge;
}
function hasBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readCache(lat, lon, year) {
  const key = cacheKey(lat, lon, year);
  const memory = memoryCache.get(key);
  if (isFresh(memory)) return structuredClone(memory.data);
  if (!hasBrowserStorage()) return null;
  try {
    const cached = JSON.parse(
      window.localStorage.getItem(key) ?? "null",
    );
    if (cached?.version !== 3 || !isFresh(cached)) return null;
    validateSoil(cached.data.soil);
    if (
      !Array.isArray(cached.data.climateDaily) ||
      !Array.isArray(cached.data.ndviSeries)
    )
      return null;
    return cached.data;
  } catch {
    return null;
  }
}
function writeCache(lat, lon, year, data) {
  const key = cacheKey(lat, lon, year);
  const entry = { version: 3, savedAt: Date.now(), data: structuredClone(data) };
  memoryCache.set(key, entry);
  if (memoryCache.size > 500)
    memoryCache.delete(memoryCache.keys().next().value);
  if (!hasBrowserStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    /* Private mode / full storage: memory cache and fallback still work. */
  }
}

/**
 * Synchronous starting point: a cached live result if one exists, otherwise the
 * compact regional fallback. Call fetchUnifiedFarmData to retrieve live observations.
 */
function getInitialFarmData(lat, lon, presetId, { year = targetDataYear() } = {}) {
  const cached = readCache(lat, lon, year);
  if (cached)
    return {
      ...cached,
      lat,
      lon,
      sources: Object.fromEntries(
        Object.entries(cached.sources).map(([key, source]) => [
          key,
          { ...source, status: source.kind === "observed" ? "cached" : "demo" },
        ]),
      ),
    };
  const preset = presets[presetId] ?? nearestPreset(lat, lon);
  return {
    lat,
    lon,
    year,
    presetId: preset.id,
    ...expandFallback(preset, year),
    ndviHistory: null,
    referenceEtDrivers: null,
    harmonizationMeta: harmonizationMeta(lat, lon, year),
    sources: Object.fromEntries(
      ["climate", "soil", "ndvi"].map((key) => [
        key,
        {
          status: "demo",
          kind: "synthetic",
          provider:
            key === "climate"
              ? "NASA POWER"
              : key === "soil"
                ? "SoilGrids"
                : "MODIS MOD13Q1",
          regionalPreset: preset.id,
          reason:
            "Compact regional fallback (monthly means of a 2025 snapshot); live observations not retrieved.",
        },
      ]),
    ),
  };
}

async function fetchJson(url, signal) {
  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).host}`);
  return response.json();
}

// ORNL limits the subset service; keep a few requests in flight at a time.
let modisActive = 0;
const modisQueue = [];
function limitedModisFetch(url, signal) {
  return new Promise((resolve, reject) => {
    const run = () => {
      modisActive++;
      fetchJson(url, signal)
        .then(resolve, reject)
        .finally(() => {
          modisActive--;
          modisQueue.shift()?.();
        });
    };
    if (modisActive < MODIS_CONCURRENCY) run();
    else modisQueue.push(run);
  });
}

const MODIS_BASE = "https://modis.ornl.gov/rst/api/v1/MOD13Q1/subset";
const modisUrl = (lat, lon, band, year, startDoy, endDoy) =>
  `${MODIS_BASE}?latitude=${lat}&longitude=${lon}&band=${band}&startDate=A${year}${pad3(startDoy)}&endDate=A${year}${pad3(endDoy)}&kmAboveBelow=0&kmLeftRight=0`;
const GRID_KEYS = ["xllcorner", "yllcorner", "cellsize", "nrows", "ncols"];

/** Fetches one MODIS band for several ≤10-composite DOY windows and checks the pixel grid. */
async function fetchModisBand(lat, lon, band, year, windows, signal) {
  const chunks = await Promise.all(
    windows.map(([start, end]) =>
      limitedModisFetch(modisUrl(lat, lon, band, year, start, end), signal),
    ),
  );
  if (chunks.some((c) => c.nrows !== 1 || c.ncols !== 1))
    throw new Error("Unexpected MODIS grid");
  const grid = Object.fromEntries(GRID_KEYS.map((key) => [key, chunks[0][key]]));
  if (chunks.some((c) => GRID_KEYS.some((key) => c[key] !== grid[key])))
    throw new Error("Inconsistent MODIS chunk grids");
  if (
    band === "250m_16_days_NDVI" &&
    chunks.some((c) => Number(c.scale) !== 0.0001)
  )
    throw new Error("Unrecognized MODIS scale");
  return { subset: chunks.flatMap((c) => c.subset ?? []), grid };
}

async function fetchModisYear(lat, lon, year, windows, signal) {
  const [ndvi, qa] = await Promise.all(
    ["250m_16_days_NDVI", "250m_16_days_pixel_reliability"].map((band) =>
      fetchModisBand(lat, lon, band, year, windows, signal),
    ),
  );
  if (JSON.stringify(ndvi.grid) !== JSON.stringify(qa.grid))
    throw new Error("MODIS QA pixel grid mismatch");
  return { series: parseModis(ndvi, qa, year), grid: ndvi.grid };
}

// Full year: composites DOY 1…353 in three ≤10-date windows.
const FULL_YEAR_WINDOWS = [
  [1, 145],
  [161, 305],
  [321, 353],
];
// Summer baseline: the 10 composites starting May–Sep (DOY 129…273).
const SUMMER_WINDOW = [[129, 273]];

async function fetchNdviHistory(lat, lon, year, signal) {
  const years = Array.from({ length: HISTORY_YEARS }, (_, i) => year - HISTORY_YEARS + i);
  const results = await Promise.allSettled(
    years.map((y) => fetchModisYear(lat, lon, y, SUMMER_WINDOW, signal)),
  );
  return {
    years: results.map((result, i) => {
      if (result.status !== "fulfilled")
        return {
          year: years[i],
          validComposites: 0,
          expectedComposites: 10,
          peak: null,
          accepted: false,
          reason: result.reason?.message ?? "Request failed",
        };
      const summer = result.value.series.filter(
        (p) => p.date.slice(5, 7) >= "05" && p.date.slice(5, 7) <= "09",
      );
      const valid = summer.filter((p) => validNumber(p.ndvi));
      return {
        year: years[i],
        validComposites: valid.length,
        expectedComposites: 10,
        peak: valid.length ? Math.max(...valid.map((p) => p.ndvi)) : null,
        accepted: valid.length >= 8,
        grid: result.value.grid,
      };
    }),
  };
}

/**
 * Retrieves live observations for a field centroid in Egypt. Each source that fails
 * keeps its fallback value and carries the failure reason in data.sources[key].reason.
 */
async function fetchUnifiedFarmData(
  lat,
  lon,
  presetId,
  {
    signal: parentSignal,
    timeoutMs = REQUEST_TIMEOUT_MS,
    year = targetDataYear(),
    useCache = true,
  } = {},
) {
  if (
    !validNumber(lat) ||
    !validNumber(lon) ||
    lat < 22 ||
    lat > 32.5 ||
    lon < 24 ||
    lon > 37
  )
    throw new Error("Select a location within Egypt (22–32.5°N, 24–37°E).");

  const key = cacheKey(lat, lon, year);
  if (useCache) {
    const memory = memoryCache.get(key);
    if (isFresh(memory)) return structuredClone(memory.data);
    // Concurrent requests for the same field share one set of API calls.
    if (inFlight.has(key) && !parentSignal)
      return structuredClone(await inFlight.get(key));
  }
  const request = fetchLive(lat, lon, presetId, {
    parentSignal,
    timeoutMs,
    year,
  });
  if (!parentSignal) inFlight.set(key, request);
  try {
    return structuredClone(await request);
  } finally {
    if (inFlight.get(key) === request) inFlight.delete(key);
  }
}

async function fetchLive(lat, lon, presetId, { parentSignal, timeoutMs, year }) {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  parentSignal?.addEventListener("abort", onAbort, { once: true });
  if (parentSignal?.aborted) controller.abort();
  let timer;
  const preset = presets[presetId] ?? nearestPreset(lat, lon);
  const data = {
    ...getInitialFarmData(lat, lon, preset.id, { year }),
    lat,
    lon,
    year,
    presetId: preset.id,
    harmonizationMeta: harmonizationMeta(lat, lon, year),
  };
  // Never reuse cached sources as a base for a fresh fetch: start from the fallback.
  Object.assign(data, expandFallback(preset, year), {
    ndviHistory: null,
    referenceEtDrivers: null,
  });
  const { signal } = controller;
  const powerUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M_MAX,T2M_MIN,PRECTOTCORR,EVPTRNS,GWETROOT,GWETTOP,RH2M,WS2M,ALLSKY_SFC_SW_DWN,PS&community=AG&longitude=${lon}&latitude=${lat}&start=${year}0101&end=${year}1231&format=JSON`;
  const isricUrl = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=clay&property=sand&property=soc&property=nitrogen&property=phh2o&depth=0-5cm&depth=5-15cm&value=mean`;
  const expectedNdviDates = new Set(modisCompositeDates(year));
  const snapshots = [];
  const tasks = [
    fetchJson(powerUrl, signal)
      .then((payload) =>
        parsePower(payload, { requireComplete: true, year, lat, lon, url: powerUrl }),
      )
      .then((value) => ({ value, provider: "NASA POWER", url: powerUrl })),
    fetchJson(isricUrl, signal)
      .then(parseIsric)
      .then((value) => ({ value, provider: "ISRIC SoilGrids 2.0", url: isricUrl })),
    // Retrieve QA alongside NDVI; never accept unscreened pixels.
    fetchModisYear(lat, lon, year, FULL_YEAR_WINDOWS, signal).then(
      ({ series, grid }) => {
        if (
          series.length !== 23 ||
          series.some((p) => !expectedNdviDates.has(p.date))
        )
          throw new Error("Incomplete MODIS calendar");
        return {
          value: series,
          grid,
          provider: "ORNL DAAC MODIS MOD13Q1 · QA screened",
          url: "https://modis.ornl.gov/data/modis_webservice.html",
        };
      },
    ),
    fetchNdviHistory(lat, lon, year, signal),
  ].map((task, index) =>
    task.then(
      (value) => {
        snapshots[index] = { status: "fulfilled", value };
        return value;
      },
      (reason) => {
        snapshots[index] = { status: "rejected", reason };
        throw reason;
      },
    ),
  );
  try {
    // A race enforces the deadline even if a fetch implementation ignores abort.
    const deadline = new Promise((resolve) => {
      timer = setTimeout(() => {
        controller.abort();
        resolve(null);
      }, timeoutMs);
    });
    const results = await Promise.race([Promise.allSettled(tasks), deadline]);
    if (parentSignal?.aborted)
      throw new DOMException("Cancelled", "AbortError");
    const retrievedAt = new Date().toISOString();
    for (const [i, key] of ["climate", "soil", "ndvi"].entries()) {
      const result = results?.[i] ?? snapshots[i];
      if (result?.status === "fulfilled") {
        const { value, provider, url } = result.value;
        if (key === "climate") Object.assign(data, value);
        else data[key === "soil" ? "soil" : "ndviSeries"] = value;
        data.sources[key] = {
          status: "live",
          kind: "observed",
          provider,
          url,
          retrievedAt,
          period: key === "soil" ? "SoilGrids 2.0 static prediction" : String(year),
        };
      } else
        data.sources[key] = {
          ...data.sources[key],
          reason:
            result?.reason?.message ??
            `${Math.round(timeoutMs / 1000)}-second deadline; using compact fallback.`,
        };
    }
    // Canopy-anomaly baseline: only same-pixel history next to observed current NDVI.
    const history = (results?.[3] ?? snapshots[3])?.value;
    const currentGrid = (results?.[2] ?? snapshots[2])?.value?.grid;
    if (history && currentGrid && data.sources.ndvi.kind === "observed")
      data.ndviHistory = {
        lat,
        lon,
        retrievedAt,
        policy: `${year - HISTORY_YEARS}–${year - 1} annual May–Sep peak; >=8/10 good QA=0 composites/year; same native pixel; >=3 accepted years for sample z-score. Baseline excludes ${year}.`,
        years: history.years.map(({ grid, ...row }) => ({
          ...row,
          accepted:
            row.accepted &&
            !!grid &&
            JSON.stringify(grid) === JSON.stringify(currentGrid),
        })),
      };
    writeCache(lat, lon, year, data);
    return data;
  } finally {
    clearTimeout(timer);
    parentSignal?.removeEventListener("abort", onAbort);
  }
}

async function fetchFieldData({ lat, lon, presetId, ...options } = {}) {
  return fetchUnifiedFarmData(lat, lon, presetId, options);
}


/**
 * Multi-Sensor Harmonization & Resolution Specification
 * Explicitly describes the spatial, temporal, and physical characteristics of each sensor layer,
 * how they are fused into Egyptian agricultural seasons, and the relationship between satellite
 * proxies and in-situ ground-truth measurements.
 */
const DATA_HARMONIZATION_SPEC = {
  sensors: [
    {
      id: "nasa_power",
      name: "NASA POWER (Agroclimatology)",
      satelliteSystem: "GEOS-5 / MERRA-2 assimilation & CERES radiation",
      spatialResolution: "0.5° × 0.5° (~50 km at Egypt latitude)",
      temporalResolution: "Daily continuous (1981–present)",
      parameters: ["T2M_MAX", "T2M_MIN", "PRECTOTCORR", "EVPTRNS", "ALLSKY_SFC_SW_DWN"],
      physicalUnits: {
        tmax: "°C",
        tmin: "°C",
        precipitation: "mm/day",
        evapotranspiration: "MJ/m²/day (energy) & mm/day (FAO-56 Penman-Monteith)",
      },
      roleInPipeline: "Provides macro-climatic energy drivers, heatwave frequency (>38°C), and daily baseline reference ET0.",
    },
    {
      id: "modis_landsat",
      name: "MODIS (MOD13Q1) & Landsat 8/9 / Sentinel-2",
      satelliteSystem: "Terra/Aqua MODIS, USGS/NASA Landsat 8-9, Copernicus Sentinel-2 MSI",
      spatialResolution: "10 m – 30 m (Landsat/Sentinel-2) / 250 m (MODIS 16-day composite)",
      temporalResolution: "5–16 days composite with QA pixel reliability filtering",
      parameters: ["NDVI (Normalized Difference Vegetation Index)", "Pixel Reliability QA"],
      physicalUnits: {
        ndvi: "Dimensionless ratio (-0.2 to 1.0)",
        qa: "Reliability bitmask (0 = good quality, >1 = cloud/snow/shadow)",
      },
      roleInPipeline: "Tracks field canopy greenness, identifies bare-soil windows (NDVI < 0.20), and flags historical canopy anomalies.",
    },
    {
      id: "smap",
      name: "NASA SMAP (Soil Moisture Active Passive)",
      satelliteSystem: "SMAP L-band radiometer / Level-4 Surface & Root-Zone Soil Moisture",
      spatialResolution: "9 km – 36 km grid",
      temporalResolution: "2–3 days revisit",
      parameters: ["GWETROOT (Root-zone wetness 0–100 cm)", "GWETTOP (Surface wetness 0–5 cm)"],
      physicalUnits: {
        soilWetness: "Degree of saturation (fractional 0.0 to 1.0)",
      },
      roleInPipeline: "Measures macro soil moisture status and identifies drought / water deficit stress across agricultural basins.",
    },
    {
      id: "soilgrids",
      name: "ISRIC SoilGrids / Digital Soil Mapping",
      satelliteSystem: "Machine learning ensemble fitted with 240,000 global soil profiles & Earth observation covariates",
      spatialResolution: "250 m grid",
      temporalResolution: "Static baseline depth intervals (0–5 cm, 5–15 cm, 15–30 cm)",
      parameters: ["clay (%)", "sand (%)", "phh2o (pH × 10)", "soc (g/kg)", "nitrogen (cg/kg)"],
      physicalUnits: {
        clay: "% by weight",
        phh2o: "Standard pH units",
        soc: "g/kg (Soil Organic Carbon)",
      },
      roleInPipeline: "Initial soil texture screening, soil alkalinity baseline, and organic carbon context.",
    },
  ],

  harmonizationPipeline: {
    spatialHarmonization: {
      method: "Centroid-anchored multi-scale bounding-box query with perimeter buffer screening.",
      descriptionEn:
        "High-resolution parcel polygons (10m–30m) are overlaid on coarse climate (50km) and soil moisture (9–36km) grids. Nearest-neighbor and bilinear interpolation assign macro-climate values to the field centroid while parcel boundaries query high-resolution NDVI pixels, masking out desert-fringe non-agricultural pixels.",
      descriptionAr:
        "يتم دمج إحداثيات الحقل التفصيلية مع شبكات المناخ والرطوبة الواسعة. تُسند بيانات المناخ العام ودرجات الحرارة لمركز الحقل، بينما تُقاس مؤشرات الغطاء النباتي (NDVI) بدقة البكسل الزراعي فقط مع استبعاد البكسلات المختلطة بحواف الصحراء.",
    },
    temporalHarmonization: {
      aggregationWindows: [
        {
          seasonEn: "Shitwi (Winter Season)",
          seasonAr: "العروة الشتوية",
          months: [11, 12, 1, 2, 3, 4],
          durationDays: 181,
          descriptionEn: "November 1 to April 30: Wheat, Berseem Clover, Broad Beans, Sugar Beet.",
          descriptionAr: "من أول نوفمبر إلى نهاية أبريل: القمح، البرسيم المصري، الفول البلدي، بنجر السكر.",
        },
        {
          seasonEn: "Seifi (Summer Season)",
          seasonAr: "العروة الصيفية",
          months: [5, 6, 7, 8, 9],
          durationDays: 153,
          descriptionEn: "May 1 to September 30: Maize, Rice, Cotton, Sorghum, Soybeans.",
          descriptionAr: "من أول مايو إلى نهاية سبتمبر: الذرة الشامية، الأرز، القطن، الذرة الرفيعة، فول الصويا.",
        },
        {
          seasonEn: "Nili (Autumn Transition / Nile Season)",
          seasonAr: "العروة النيلية وفترة التغطية",
          months: [9, 10, 11],
          durationDays: 91,
          descriptionEn: "September 1 to November 30: Short-duration Maize, Nili Cowpea, Fahl Clover, Potatoes.",
          descriptionAr: "من سبتمبر إلى نوفمبر: الذرة النيلية، لوبيا العلف، البرسيم الفحل، والبطاطس النيلي.",
        },
      ],
      descriptionEn:
        "Daily meteorological records (365 points) are aggregated into cumulative seasonal energy balances (MJ/m²), heat-stress day counts (>38°C), and 16-day composite NDVI steps, directly matching Egyptian cropping rotations.",
      descriptionAr:
        "يتم تجميع الأرصاد اليومية (٣٦٥ يوماً) في أرصدة طاقة تراكمية وعدد أيام الإجهاد الحراري وخطوات NDVI الدورية لتتوافق مباشرة مع مواسم الزراعة المصرية.",
    },
    groundTruthComparison: {
      satelliteRole:
        "Screening, trend detection, radiative energy balance, and regional risk mapping.",
      groundTruthRole:
        "Definitive field diagnosis: calibrated laboratory saturated-paste ECe (dS/m), in-situ soil tensiometers, certified seed germination checks, and on-site pest scouting.",
      disclaimerEn:
        "Satellite observations detect optical reflections and radiative flux from the canopy surface; they cannot determine subsurface root-zone salt accumulation or localized pathogen pressure. In-situ ground truth remains the authoritative operational standard.",
      disclaimerAr:
        "تقيس الأقمار الصناعية الانعكاسات الضوئية والتوازن الإشعاعي للسطح؛ ولا تستطيع قياس الأملاح العميقة حول الجذور أو الآفات الموضعية. القياس المعماري والمعاينة الأرضية تظل الأساس الميداني المعتمد.",
    },
  },
};

/**
 * Returns a human-friendly and machine-readable explanation of data harmonization.
 */
function explainDataHarmonization(lang = "en") {
  const isAr = lang === "ar";
  return {
    title: isAr ? "دليل مواءمة ودمج بيانات الأقمار الصناعية" : "Satellite Multi-Sensor Fusion & Harmonization Guide",
    spec: DATA_HARMONIZATION_SPEC,
    summary: isAr
      ? "تدمج المنظومة بيانات ناسا POWER اليومية الواسعة (~50 كم) لحساب درجات الحرارة والبخر، مع صور موديس ولاندسات الدقيقة (10-250م) لرصد الغطاء النباتي وفترات انكشاف الأرض، وتوفيرها وفق العروات المصرية (الشتوية، الصيفية، النيلية) مع التأكيد على ضرورة القياسات الأرضية المعملية للملوحة."
      : "FieldShift harmonizes wide daily NASA POWER grids (~50 km) for temperatures and ET0 with fine-resolution MODIS/Landsat/Sentinel (10-250 m) composites for NDVI canopy vigor and bare-soil gaps, aligning them to Egypt's agricultural seasons (Shitwi, Seifi, Nili) alongside ground-truth validation rules.",
  };
}




  // --- farmerModel.js ---
  // Presentation adapters only; all scoring and candidate selection stays in the engine.
const GOALS = {
  water: {
    en: "Save irrigation water",
    ar: "أوفّر مياه الري",
    weights: { water: 70, soil: 20, market: 10 },
  },
  soil: {
    en: "Improve soil condition",
    ar: "أحافظ على خصوبة الأرض",
    weights: { water: 20, soil: 70, market: 10 },
  },
  market: {
    en: "Consider market / forage return",
    ar: "أراعي العائد والأعلاف",
    weights: { water: 20, soil: 20, market: 60 },
  },
};
function selectGoal(inputs, goal) {
  return { ...inputs, goal, weights: { ...GOALS[goal].weights } };
}
function areaIsValid(inputs) {
  const f = Number(inputs.feddans),
    q = Number(inputs.qirats);
  return (
    (String(inputs.feddans).trim() !== "" ||
      String(inputs.qirats).trim() !== "") &&
    Number.isFinite(f) &&
    f >= 0 &&
    f <= 100000 &&
    Number.isInteger(q) &&
    q >= 0 &&
    q <= 23 &&
    f + q / 24 > 0 &&
    f + q / 24 <= 100000
  );
}
function evaluationInputs(inputs) {
  // The engine requires a positive scale. One feddan is a comparison basis,
  // never a claim about the user's field area. UI totals require explicit valid area.
  return inputs.estimateArea && areaIsValid(inputs)
    ? inputs
    : { ...inputs, feddans: 1, qirats: 0 };
}
function proposedStrategy(evaluation) {
  return evaluation.strategies.find(
    (s) => s.id === evaluation.rankedStrategyIds[0],
  );
}
function warningLayers(strategy, data, diagnostics) {
  const critical = strategy.warnings.filter((w) =>
    /measured soil ECe|Nili cover is conditional|no outcome-matched quantitative FAO salinity response/.test(
      w.en,
    ),
  );
  if (Object.values(data.sources).some((s) => s.kind === "synthetic"))
    critical.unshift({
      en: "Some inputs are illustrative fallback data, not observations of your field. Review the evidence before planting.",
      ar: "بعض المدخلات بيانات توضيحية بديلة وليست أرصاداً لأرضك. راجع الأدلة قبل الزراعة.",
    });
  if (
    diagnostics.summerObservationDays < 153 ||
    diagnostics.autumnMissingDays > 0
  )
    critical.push({
      en: "Historical observations are incomplete; missing periods do not establish low risk.",
      ar: "الأرصاد التاريخية غير مكتملة؛ الفترات المفقودة لا تعني إن المخاطر قليلة.",
    });
  return {
    critical: [...new Map(critical.map((w) => [w.en, w])).values()],
    contextual: strategy.warnings.filter((w) => !critical.includes(w)),
  };
}

function buildFarmerModel(evaluation, inputs, data, lang = "en") {
  const proposed = proposedStrategy(evaluation);
  const warnings = proposed
    ? warningLayers(proposed, data, evaluation.diagnostics)
    : { critical: [], contextual: [] };
  return {
    proposed,
    strategies: (evaluation.strategies || []).map((s) => ({
      ...s,
      displayName: lang === "ar" ? s.labelAr : s.labelEn,
      cropsList: s.crops.map((c) => (lang === "ar" ? c.nameAr : c.nameEn)),
    })),
    diagnostics: evaluation.diagnostics,
    scenarioSimulation: evaluation.scenarioSimulation ?? null,
    warnings,
    pitchCounterfactual: evaluation.pitchCounterfactual,
    candidateAudit: evaluation.candidateAudit,
  };
}



  // --- i18n.js ---
  const text = (lang, en, ar) => (lang === "ar" ? ar : en);

const formatNumber = (value, lang = "en", options = {}) =>
  value == null
    ? "—"
    : new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-GB", {
        maximumFractionDigits: 1,
        ...options,
      }).format(value);

const sourceLabel = (source, lang) => {
  const labels = {
    live: ["Retrieved source data", "بيانات مصدر مسترجعة"],
    cached: ["Cached source data", "بيانات مصدر محفوظة"],
    snapshot: ["Audited historical snapshot", "نسخة تاريخية مدققة"],
    demo: ["Illustrative demo fixture", "بيانات تجريبية توضيحية"],
  };
  const label = labels[source?.status] ?? labels.demo;
  return text(lang, ...label);
};

/**
 * Simplified Scientific Glossary for Farmers (قاموس المصطلحات الزراعية المبسط)
 * Translates complex NASA Earth observation parameters into intuitive everyday language for Egyptian farmers.
 */
const SCIENTIFIC_GLOSSARY = {
  evapotranspiration: {
    key: "evapotranspiration",
    symbol: "ET₀",
    nameEn: "Evapotranspiration (ET₀)",
    nameAr: "البخر-نتح (استهلاك المية)",
    simpleConceptEn: "Water lost to atmosphere from soil and plants (mm/day).",
    simpleConceptAr: "كمية المية اللي الأرض والزرع بيفقدوها في الجو بسبب الحر والشمس والهوا.",
    farmerExplanationEn:
      "Measures daily crop thirst in millimeters. High ET₀ means sun and wind are pulling water rapidly from your field, requiring timely irrigation to prevent wilting.",
    farmerExplanationAr:
      "بتقيس عطش الزرع بالمليمتر كل يوم؛ كل ما الرقم ده يعلى، معناه إن الشمس والهوا بيسحبوا المية بسرعة من الغيط، والزرع محتاج ري في ميعاده عشان ميعطش.",
    unit: "mm/day",
  },

  ndvi: {
    key: "ndvi",
    symbol: "NDVI",
    nameEn: "Vegetation Index (NDVI)",
    nameAr: "مؤشر الغطاء النباتي (خضار الزرع)",
    simpleConceptEn: "Satellite greenness and crop canopy health (0.0 to 1.0).",
    simpleConceptAr: "مقياس لقوة خضار وصحة أوراق الزرع من القمر الصناعي.",
    farmerExplanationEn:
      "Calculated from reflected sunlight. Values below 0.20 indicate bare or dry soil; values above 0.60 show dense, healthy, thriving crop foliage.",
    farmerExplanationAr:
      "بيتحسب من انعكاس الشمس على الورق؛ لو أقل من ٠.٢٠ يبقى الأرض بور أو مكشوفة للشمس، ولو عدى ٠.٦٠ يبقى الغيط مخضر ومزدهر وصحته كويسة جداً.",
    unit: "ratio (0 to 1)",
  },

  soilMoistureAnomaly: {
    key: "soilMoistureAnomaly",
    symbol: "GWETROOT",
    nameEn: "Soil Moisture Anomaly",
    nameAr: "شذوذ رطوبة التربة في الجذور",
    simpleConceptEn: "Root-zone water comparison vs 10-year historical average.",
    simpleConceptAr: "مقارنة رطوبة الأرض في عمق الجذور بمتوسط السنين اللي فاتت في نفس التوقيت.",
    farmerExplanationEn:
      "Indicates whether root-zone moisture is wetter or drier than usual for this time of year, helping adjust irrigation before water stress sets in.",
    farmerExplanationAr:
      "بيعرفك هل الأرض في عمق الجذور أشد جفافاً أو أزيد رطوبة من المعتاد في الوقت ده من السنة، عشان تظبط نوبات الري قبل ما الزرع يتأثر.",
    unit: "saturation index (0 to 1)",
  },

  bareSoilWindow: {
    key: "bareSoilWindow",
    symbol: "Bare-Run",
    nameEn: "Bare-Field Vulnerability Window",
    nameAr: "فترة خلو وانكشاف الأرض بين العروات",
    simpleConceptEn: "Days where field is left unplanted without vegetative cover.",
    simpleConceptAr: "الأيام اللي الأرض بتقعد فيها فاضية ومكشوفة للشمس بين حصاد عروة وزراعة اللي بعدها.",
    farmerExplanationEn:
      "Leaving soil bare under hot sun breaks down organic carbon and accelerates moisture evaporation. Sowing quick cover crops like Berseem Fahl protects topsoil fertility.",
    farmerExplanationAr:
      "لما الأرض تقعد فاضية تحت الشمس المحرقة، المادة العضوية بتتفكك والرطوبة بتتبخر في الهوا. زراعة غطاء سريع زي البرسيم الفحل أو اللوبيا بيحمي الأرض ويزود غلتها.",
    unit: "days",
  },

  nitrogenFixation: {
    key: "nitrogenFixation",
    symbol: "N-Fix",
    nameEn: "Biological Nitrogen Fixation",
    nameAr: "تثبيت النيتروجين الحيوي (خصوبة طبيعية)",
    simpleConceptEn: "Legumes capturing atmospheric nitrogen to feed the soil.",
    simpleConceptAr: "قدرة البقوليات إنها تسحب النيتروجين من الهوا وتخزنه كسماد طبيعي في الأرض.",
    farmerExplanationEn:
      "Legumes (clover, cowpea, soybeans) host friendly root bacteria that produce natural nitrogen, slashing your chemical fertilizer and urea bills for the following crop.",
    farmerExplanationAr:
      "محاصيل زي البرسيم واللوبيا والصويا فيها بكتيريا نافعة في الجذور بتسحب النيتروجين من الجو وتثبته في الطين، فتوفر عليك شكاير الكيماوي واليوريا للمحصول اللي جاي.",
    unit: "kg N/feddan balance",
  },

  salinityEce: {
    key: "salinityEce",
    symbol: "ECe",
    nameEn: "Soil Salinity (ECe)",
    nameAr: "ملوحة التربة المعملية (ECe)",
    simpleConceptEn: "Laboratory salt concentration in saturated soil extract (dS/m).",
    simpleConceptAr: "درجة ملوحة الطين في المعمل؛ بتوضح مدى صعوبة امتصاص الجذور للمية.",
    farmerExplanationEn:
      "Values above 4 dS/m create osmotic resistance, making it hard for crop roots to absorb water even in wet soil. Requires salt-tolerant varieties and leaching.",
    farmerExplanationAr:
      "لو الرقم عدى ٤ ديسيسيمنز/متر، الملوحة بتمسك المية وتمنع الجذور تشرب بسهولة حتى لو الأرض مروية؛ ساعتها بنحتاج نزرع محاصيل تستحمل الملوحة زي الشعير أو الذرة الرفيعة ونغسل الأرض.",
    unit: "dS/m",
  },

  heatStressDays: {
    key: "heatStressDays",
    symbol: "Tmax > 38°C",
    nameEn: "Heat Stress Days",
    nameAr: "أيام القيظ والإجهاد الحراري",
    simpleConceptEn: "Days with maximum air temperature exceeding 38°C.",
    simpleConceptAr: "عدد أيام الصيف الشديدة اللي الحرارة فيها بتعدي ٣٨ درجة مئوية.",
    farmerExplanationEn:
      "Extreme heat burns pollen, stunts flower setting, and drastically spikes water loss. Requires early morning or nocturnal irrigation cycles.",
    farmerExplanationAr:
      "موجات الحر دي بتسقط الأزهار وتوقف التحجيم وتضاعف استهلاك المية؛ وعشان كده بننصح بالري في الفجرية أو بالليل واختيار أصناف بتتحمل الحرارة.",
    unit: "days",
  },
};

/**
 * Helper to fetch a glossary term with localized fields.
 */
function getGlossaryTerm(key, lang = "en") {
  const item = SCIENTIFIC_GLOSSARY[key];
  if (!item) return null;
  const isAr = lang === "ar";
  return {
    key: item.key,
    symbol: item.symbol,
    name: isAr ? item.nameAr : item.nameEn,
    simpleConcept: isAr ? item.simpleConceptAr : item.simpleConceptEn,
    farmerExplanation: isAr ? item.farmerExplanationAr : item.farmerExplanationEn,
    unit: item.unit,
  };
}

function getAllGlossaryTerms(lang = "en") {
  return Object.keys(SCIENTIFIC_GLOSSARY).map((k) => getGlossaryTerm(k, lang));
}


  const FieldShift = {
    // Data
    egyptCrops,
    fallbackPresets,
    cropEvidence: evidence,

    // Engine
    computeFieldIndices,
    evaluateFieldAndRotations,
    rankRotations,
    generateCandidateRotations,
    assessMeasuredSalinity,
    projectCropEtc,
    computeReferenceEt,
    dailyReferenceEt,
    explainCropDecisionEvidence,
    explainStrategy,

    // Services
    getInitialFarmData,
    fetchUnifiedFarmData,
    fetchFieldData,
    nearestPreset,
    harmonizationMeta,
    DATA_HARMONIZATION_SPEC,
    explainDataHarmonization,

    // Presentation
    GOALS,
    selectGoal,
    areaIsValid,
    evaluationInputs,
    proposedStrategy,
    warningLayers,
    buildFarmerModel,

    // i18n & Glossary
    text,
    formatNumber,
    sourceLabel,
    SCIENTIFIC_GLOSSARY,
    getGlossaryTerm,
    getAllGlossaryTerms,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FieldShift;
  }
  if (typeof root !== 'undefined') {
    root.FieldShift = FieldShift;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);

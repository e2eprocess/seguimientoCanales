export class PropertiesSeries{
	constructor(
		public colorMonitor: [any]=["#004481","#0A5FB4","#2DCCCD","#2A86CA", "#D8BE75", "#5BBEFF"],
		public colorHost: [any]=["#004481","#0A5FB4","#2DCCCD","#2A86CA", "#D8BE75", "#5BBEFF"],
		public colorHostHighstock: [any]=["rgba(0,68,129,0.3)"
										,"rgba(10,95,180,0.3)"
										,"rgba(45,204,205,0.3)"
										,"rgba(42,134,202,0.3)"
										,"rgba(216,190,117,0.3)"
										,"rgba(91,190,255,0.3)"
										],
		public colorInformeTiempo: [any]=['rgba(248,0,0,1.0)','rgba(134,2,18,1.0)','rgba(244,3,32,1.0)'],
		public colorInformePeticiones: [any]=['rgba(3,61,244,1.0)','rgba(3,45,180,1.0)','rgba(3,11,180,1.0)'],
		public colorInformeCpu: [any]=['rgba(3,61,244,1.0)','rgba(3,45,180,1.0)','rgba(3,11,180,1.0)'],
		public colorInformeMemoria: [any]=['rgba(6,250,239,1.0)','rgba(5,222,212,1.0)','rgba(3,199,190,1.0)'],
		){}
}
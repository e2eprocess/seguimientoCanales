export class ValoresTabla{
	constructor(
        	public fechaPeticion: string,
                public peticionesHost: number,
                public porcentajeHost: number,
                public peticionesApx: number,
                public porcentajeApx: number,
                public sumPeticiones: number,
                public fechaMaxPeticiones: string,
                public maxPeticionesHost: number,
                public maxPorcentajeHost: number,
                public maxPeticionesApx: number,
                public maxPorcentajeApx: number,
                public sumMaxPeticiones: number
	){}
}
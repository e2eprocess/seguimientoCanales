import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { Comparativa } from './components/comparativa.component';
import { Informe } from './components/informe.component';
import { Highstock } from './components/highstock.component';
import { Seguimiento } from './components/seguimiento.component';
import { Transacciones } from './components/transacciones.component';
import { VisionMaquina } from './components/visionMaquina.component';

const appRoutes: Routes = [
	{path:'', component: Seguimiento},
	{path:'seguimiento_canales', component: Seguimiento},
	{path:'seguimiento_canales/fecha/:fechaUrl', component: Seguimiento},
	{path:'seguimiento_transacciones', component: Transacciones},
	{path:'seguimiento_transacciones/fecha/:fechaUrl', component: Transacciones},
	{path:'comparativa/:channel', component: Comparativa},
	{path:'comparativa/:channel/:name', component: Comparativa},
	{path:'comparativa/:channel/:name/:description', component: Comparativa},
	{path:'informe/:channel/:name', component: Informe},
	{path:'highstock/:channel/:idMonitor', component: Highstock},
	{path:'V_MQ/:channel', component: VisionMaquina},
	{path:'**', component: Seguimiento}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
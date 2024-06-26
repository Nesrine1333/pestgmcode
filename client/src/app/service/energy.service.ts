import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnergyService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  getProvider(address: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/provider/${address}`);
  }

  getAllProviders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/providers/addresses`);
  }
  registerProvider(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registerProvider`, data);
  }

  updateProvider(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/updateProvider`, data);
  }


  buyEnergy( userEmail: string, energyAmount: number,consumerAddress:string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {userEmail , energyAmount,consumerAddress};
    const url = `${this.apiUrl}/buy-energy`;
    
    return this.http.post(url, body, { headers });
  }

//  getConsumerEnergyBalance(consumerAddress: string): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/getConsumerEnergyBalance/${consumerAddress}`);
//   }
  getConsumerEtherBalance(consumerAddress: string): Observable<any> {
    const url = `${this.apiUrl}/getConsumerEtherBalance/${consumerAddress}`;
    return this.http.get<any>(url);
  }


  // getConsumerInfo(email: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/consumer-balance`, { email });
  // }
  getConsumerInfo(email: string):Observable<any>{
    return this.http.post(`${this.apiUrl}/getCustomerInfo`, { email })
  }
}

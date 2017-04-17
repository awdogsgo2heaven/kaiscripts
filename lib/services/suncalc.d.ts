declare module "suncalc" {
  namespace suncalc {
    export function getTimes(date: Date, lat: number, lon: number): any;
  }
  export = suncalc;
}

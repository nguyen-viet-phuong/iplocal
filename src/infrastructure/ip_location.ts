import * as maxmind from "maxmind";
import * as path from "path";

export interface IpLocationService {
  // Returns the 2-digit country code for the IP address.
  countryForIp(ipAddress: string): Promise<string>;
}

export class MmdbLocationService implements IpLocationService {
  private db: Promise<maxmind.Reader<any>>;

  constructor(filename?: string) {
    if (!filename) {
      filename = __dirname + "/../db/GeoLite2-Country.mmdb";
    }
    this.db = maxmind.open(filename, {
      watchForUpdates: true,
      watchForUpdatesNonPersistent: true
    });
  }

  countryForIp = async (ipAddress: string) => {
    const lookup = await this.db;
    if (!maxmind.validate(ipAddress)) {
      throw new Error("Invalid IP address");
    }
    const result = lookup.get(ipAddress);
    return (result && result.country && result.country.iso_code) || "ZZ";
  };
}

export class CachedIpLocationService implements IpLocationService {
  private countryCache: Map<string, Promise<string>>;

  constructor(private locationService: IpLocationService) {
    this.countryCache = new Map<string, Promise<string>>();
  }

  countryForIp(ipAddress: string): Promise<string> {
    if (this.countryCache.has(ipAddress)) {
      return this.countryCache.get(ipAddress);
    }
    const promise = this.locationService.countryForIp(ipAddress);
    this.countryCache.set(ipAddress, promise);
    return promise;
  }
}

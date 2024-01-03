import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OverpassApiResponse } from '../../../shared/src/types/OpenStreetMap/CityResponse';

@Injectable()
export class LocationService {
  async getLocation(location: string): Promise<OverpassApiResponse> {
    const query = `
        [out:json];
        area["name"="United States"]->.usa;
        (
        node(area.usa)["place"="city"]["name"~"^${location}", i];
        );
        out body;
        `;

    const response = await axios.get(
      `http://overpass-api.de/api/interpreter?data=${encodeURIComponent(
        query,
      )}`,
    );

    return response.data;
  }
}

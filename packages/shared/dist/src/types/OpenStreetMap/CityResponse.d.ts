export type OverpassApiResponse = {
    version: number;
    generator: string;
    osm3s: {
        timestamp_osm_base: string;
        timestamp_areas_base: string;
        copyright: string;
    };
    elements: Element[];
};
type Element = {
    type: string;
    id: number;
    lat: number;
    lon: number;
    tags: Tags;
};
type Tags = {
    admin_level?: string;
    alt_name?: string;
    capital?: string;
    ele?: string;
    multi_postcode_place?: string;
    name: string;
    [key: string]: string | undefined;
    official_name?: string;
    place?: string;
    population?: string;
    population_date?: string;
    rank?: string;
    source_population?: string;
    teryt_rm?: string;
    teryt_simc?: string;
    teryt_stan_na?: string;
    teryt_terc?: string;
    teryt_updated_by?: string;
    website?: string;
    wikidata?: string;
    wikipedia?: string;
};
export {};

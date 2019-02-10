CREATE TABLE IF NOT EXISTS immobilienscout24_berlin.address (
  listing_id                                    INTEGER       ENCODE DELTA32K NOT NULL,
  realEstate_address_city                       VARCHAR(20)   ENCODE LZO,
  realEstate_address_geoHierarchy_city_name     VARCHAR(20)   ENCODE LZO,
  realEstate_address_geoHierarchy_country_name  VARCHAR(10)   ENCODE LZO,
  realEstate_address_geoHierarchy_quarter_name  VARCHAR(100)  ENCODE LZO,
  realEstate_address_geoHierarchy_region_name   VARCHAR(50)   ENCODE LZO,
  realEstate_address_postcode                   VARCHAR(10)   ENCODE LZO
  PRIMARY KEY(listing_id)
)
DISTKEY (listing_id);
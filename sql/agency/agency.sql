CREATE TABLE IF NOT EXISTS immobilienscout24_berlin.agency (
  listing_id                                    INTEGER         ENCODE DELTA32K NOT NULL,
  contactDetails_company                        VARCHAR(100)    ENCODE LZO,
  contactDetails_email                          VARCHAR(100)    ENCODE LZO,
  contactDetails_firstname                      VARCHAR(100)    ENCODE LZO,
  contactDetails_lastname                       VARCHAR(100)    ENCODE LZO,
  contactDetails_cellPhoneNumber                VARCHAR(10)     ENCODE LZO,
  contactDetails_cellPhoneNumberAreaCode        VARCHAR(10)     ENCODE LZO
  contactDetails_cellPhoneNumberCountryCode     VARCHAR(10)     ENCODE LZO,    
  contactDetails_phoneNumber                    VARCHAR(10)     ENCODE LZO,
  contactDetails_phoneNumberAreaCode            VARCHAR(10)     ENCODE LZO,
  contactDetails_phoneNumberCountryCode         VARCHAR(10)     ENCODE LZO
  PRIMARY KEY(listing_id)
)
DISTKEY (listing_id);
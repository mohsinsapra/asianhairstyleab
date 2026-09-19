// Generated from the SumUp catalogue. Edit prices/durations here — nothing else reads them.
// duration = minutes, price = SEK, maxConcurrent = how many can run in parallel.

export const CATEGORIES = [
  {
    "id": "klippning",
    "sv": "Klippning",
    "en": "Haircuts",
    "blurbSv": "Klippning för dam, herr och barn",
    "blurbEn": "Cuts for women, men and kids"
  },
  {
    "id": "farg",
    "sv": "Färg & slingor",
    "en": "Colour & highlights",
    "blurbSv": "Balayage, folieslingor och utväxtfärg",
    "blurbEn": "Balayage, foils and root touch-ups"
  },
  {
    "id": "behandling",
    "sv": "Hårbehandlingar",
    "en": "Hair treatments",
    "blurbSv": "Keratin, protein, Fiberplex och permanent",
    "blurbEn": "Keratin, protein, Fiberplex and perms"
  },
  {
    "id": "styling",
    "sv": "Styling",
    "en": "Styling",
    "blurbSv": "Tvätt, fön och plattång",
    "blurbEn": "Wash, blow-dry and straightening"
  },
  {
    "id": "bryn",
    "sv": "Bryn & fransar",
    "en": "Brows & lashes",
    "blurbSv": "Browlift, lashlift, trådning och färg",
    "blurbEn": "Brow lift, lash lift, threading and tinting"
  },
  {
    "id": "vaxning",
    "sv": "Vaxning & trådning",
    "en": "Waxing & threading",
    "blurbSv": "Hårborttagning för kropp och ansikte",
    "blurbEn": "Body and facial hair removal"
  },
  {
    "id": "henna",
    "sv": "Henna",
    "en": "Henna",
    "blurbSv": "Henna och henna-tatueringar",
    "blurbEn": "Henna and henna tattoos"
  },
  {
    "id": "ansikte",
    "sv": "Ansiktsbehandling",
    "en": "Facials",
    "blurbSv": "Rengöring och vård för huden",
    "blurbEn": "Cleansing and skincare"
  }
];

export const SERVICES = [
  {
    "id": "balayage",
    "category": "farg",
    "sv": "Balayage – frihandsteknik",
    "en": "Balayage – freehand technique",
    "duration": 270,
    "price": 1500,
    "maxConcurrent": 1,
    "images": [
      "assets/services/img_4TQ0Q6SJ679AXVPQH7AJY8H6H9.jpg"
    ],
    "sumupId": "553e4d54-8e6c-4c73-9bbf-647a1a6e0b8f",
    "sumupName": "Balajage Free hand tecknik, according to hair length och thikness"
  },
  {
    "id": "folieslingor",
    "category": "farg",
    "sv": "Folieslingor",
    "en": "Foil highlights",
    "duration": 270,
    "price": 1500,
    "maxConcurrent": 1,
    "images": [
      "assets/services/img_6W04WZN4WJ92HS5NNQ6WMFZPCN.jpg"
    ],
    "sumupId": "73ec3e81-bf5b-4861-b77c-15d4a6298a99",
    "sumupName": "Folieslingor  beror på hårs lengd och tjocklighet"
  },
  {
    "id": "utvaxtfarg",
    "category": "farg",
    "sv": "Utväxtfärg (2–3 cm)",
    "en": "Root touch-up colour (2–3 cm)",
    "duration": 90,
    "price": 700,
    "maxConcurrent": 1,
    "images": [
      "assets/services/img_04MNBCKH358TKT09RJ74RDYJ20.jpg",
      "assets/services/img_29YXSB6X409NKRZ5RKF5RVY37N.jpg"
    ],
    "sumupId": "d3eb274d-05ef-4bc1-ba34-9648633b95b8",
    "sumupName": "Utväxtfärg  2 till 3 cm"
  },
  {
    "id": "dam-axellang",
    "category": "klippning",
    "sv": "Damklippning, axellångt hår",
    "en": "Women's haircut, shoulder-length",
    "duration": 45,
    "price": 300,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_2NM3V07BJ691R9QQYF5ZJTT963.jpg",
      "assets/services/img_2G6ZFVVFVS8NWRB40BEFQHFBJ8.jpg",
      "assets/services/img_599H7PAN7G89X8X7EZ9S0EPKTQ.jpg"
    ],
    "sumupId": "65c1d964-9937-41b6-8164-a422e610b80c",
    "sumupName": "Dam klippning axellång hår (without hair wash)"
  },
  {
    "id": "dam-kort",
    "category": "klippning",
    "sv": "Damklippning, kort hår",
    "en": "Women's haircut, short hair",
    "duration": 45,
    "price": 250,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_3H2Y0AQHCR944TAB3S4JZ4KAPA.jpg",
      "assets/services/img_55JNJXQTZB8VT83QQXFJA6AD6C.jpg",
      "assets/services/img_509Y1ND8PC8DN9TP2PFKFPTB7W.jpg"
    ],
    "sumupId": "399bb890-0862-4aec-b1f3-db995f712a0c",
    "sumupName": "Dam klippning kort hår( without hair wash)"
  },
  {
    "id": "herr-klassisk",
    "category": "klippning",
    "sv": "Herrklippning, klassisk",
    "en": "Men's classic haircut",
    "duration": 45,
    "price": 250,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_3M22WB4N4E9KZTX0XZ9JSGAKEP.jpg"
    ],
    "sumupId": "3f56bf06-8cd5-4cbc-b1b6-08f38aa230a0",
    "sumupName": "Men klassisk hår klippning"
  },
  {
    "id": "barn",
    "category": "klippning",
    "sv": "Barnklippning (5–12 år)",
    "en": "Kids' haircut (5–12 yrs)",
    "duration": 45,
    "price": 200,
    "maxConcurrent": 2,
    "images": [],
    "sumupId": "a2a32df2-51c8-4778-9ce2-407acb0f95dd",
    "sumupName": "Barn klippning från 5 till 12 år"
  },
  {
    "id": "keratin",
    "category": "behandling",
    "sv": "Keratinbehandling",
    "en": "Keratin treatment",
    "duration": 360,
    "price": 1500,
    "maxConcurrent": 1,
    "images": [
      "assets/services/img_3YPYCQZBR48DWSHN42J046RNKA.jpg"
    ],
    "sumupId": "f871c66c-5d9d-4a2f-8e0d-7c6fd6fa87f3",
    "sumupName": "Keratin"
  },
  {
    "id": "permanent",
    "category": "behandling",
    "sv": "Permanent / lockar, axellångt hår",
    "en": "Perm / curls, shoulder-length",
    "duration": 240,
    "price": 1000,
    "maxConcurrent": 1,
    "images": [
      "assets/services/img_6S6KB368R9976BC4JSV8NKEV0K.jpg"
    ],
    "sumupId": "1ec01b23-8351-4351-823a-ffe56aa7ce42",
    "sumupName": "Permanant /hår lockar, axellång hår"
  },
  {
    "id": "protein",
    "category": "behandling",
    "sv": "Proteinbehandling, axellångt hår",
    "en": "Protein hair treatment, shoulder-length",
    "duration": 240,
    "price": 1000,
    "maxConcurrent": 1,
    "images": [
      "assets/services/img_5FXRS499Q48VATS0BCE3NPJYAE.jpg"
    ],
    "sumupId": "cb23b463-34b8-4e15-be64-60ca9a6e81f6",
    "sumupName": "Protein hair treatment, sholder length"
  },
  {
    "id": "fiberplex-lang",
    "category": "behandling",
    "sv": "Fiberplex-behandling, axellångt hår",
    "en": "Fiberplex treatment, shoulder-length or longer",
    "duration": 45,
    "price": 1500,
    "maxConcurrent": 1,
    "images": [],
    "sumupId": "d3e57f1d-ed65-4cfa-a0a0-c2e186ca993d",
    "sumupName": "Fiberplex Behandling axellång hår/ lite längre"
  },
  {
    "id": "fiberplex-kort",
    "category": "behandling",
    "sv": "Fiberplex-behandling, kort hår",
    "en": "Fiberplex treatment, short hair",
    "duration": 45,
    "price": 1000,
    "maxConcurrent": 1,
    "images": [
      "assets/services/img_0CWZ4PDS769SRTG4CM65VJ8N1T.jpg",
      "assets/services/img_24DYDFXZ8Z9VPBE0MR6ZXSB6GC.jpg",
      "assets/services/img_7V24B74RC29NFRGJ939XW91ARY.jpg"
    ],
    "sumupId": "2aa5eb5f-4dee-4b9a-a360-e2530deebc00",
    "sumupName": "Fiberplex Behandling kort hår"
  },
  {
    "id": "tvatt-fon",
    "category": "styling",
    "sv": "Hårtvätt & fön, axellångt hår",
    "en": "Wash & blow-dry, shoulder-length",
    "duration": 60,
    "price": 300,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_3F3QMW90NE8HSATYQ74792558R.jpg"
    ],
    "sumupId": "3759d7c0-0a94-4710-b7ed-00ca92345e22",
    "sumupName": "Hår tvätt och fön axellång hår"
  },
  {
    "id": "plattang-lockar",
    "category": "styling",
    "sv": "Plattångslockar, kort hår",
    "en": "Straightener curls, short hair",
    "duration": 45,
    "price": 300,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_379866419383XAY4DM922AKB2H.jpg"
    ],
    "sumupId": "1f129030-ba0a-49d6-8528-166b9e9dacf1",
    "sumupName": "Plattång lockar (kort hår)"
  },
  {
    "id": "plattang-rakt",
    "category": "styling",
    "sv": "Plattång, rak styling, kort hår",
    "en": "Straight styling, short hair",
    "duration": 45,
    "price": 300,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_3ASM2F4A6S8MFBHSVDF64ZC1ZA.jpg"
    ],
    "sumupId": "0c3bc0a6-2dc9-4f6f-bc5e-7714e9a59dfc",
    "sumupName": "Plattång rakt Styling ( kort hår)"
  },
  {
    "id": "browlift",
    "category": "bryn",
    "sv": "Browlift",
    "en": "Brow lift",
    "duration": 60,
    "price": 450,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_4EZ0S6C8QB924SHB589V1YKQRH.jpg"
    ],
    "sumupId": "76024f6b-71e1-4e76-bf4e-b1fe6346c89c",
    "sumupName": "Browlift"
  },
  {
    "id": "lashlift",
    "category": "bryn",
    "sv": "Lashlift",
    "en": "Lash lift",
    "duration": 60,
    "price": 450,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_53Y8T3VNMK9YCR8EZCJ25B2K0N.jpg"
    ],
    "sumupId": "abb68bd8-52b8-4e1b-ad5a-d1454d9528af",
    "sumupName": "Lashlift"
  },
  {
    "id": "bryn-trad",
    "category": "bryn",
    "sv": "Ögonbrynsformning med tråd",
    "en": "Eyebrow shaping with thread",
    "duration": 15,
    "price": 150,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_5A1P43BQZ29BJVW4HAHY2YMJY1.jpg"
    ],
    "sumupId": "e0fe993d-1971-4da3-b59c-8710ddef87c6",
    "sumupName": "Eyebrow shape with thread"
  },
  {
    "id": "bryn-farg",
    "category": "bryn",
    "sv": "Ögonbrynsformning + färg",
    "en": "Eyebrow shaping + tint",
    "duration": 45,
    "price": 250,
    "maxConcurrent": 2,
    "images": [],
    "sumupId": "f6765bfd-d7f4-4500-913e-d48d199e4df1",
    "sumupName": "Ögonbryn form + färg"
  },
  {
    "id": "vax-armar",
    "category": "vaxning",
    "sv": "Vaxning, båda armarna",
    "en": "Both arms wax",
    "duration": 60,
    "price": 500,
    "maxConcurrent": 2,
    "images": [],
    "sumupId": "ba708627-6aec-45ec-bade-1599c1be45d6",
    "sumupName": "Both Arms Wax"
  },
  {
    "id": "vax-arm",
    "category": "vaxning",
    "sv": "Vaxning, en hel arm",
    "en": "One full arm wax",
    "duration": 45,
    "price": 300,
    "maxConcurrent": 2,
    "images": [],
    "sumupId": "fc35427e-ca49-409c-9945-8a19373f81bb",
    "sumupName": "One Full Arm Wax"
  },
  {
    "id": "vax-ben",
    "category": "vaxning",
    "sv": "Vaxning, båda benen",
    "en": "Both legs wax",
    "duration": 90,
    "price": 800,
    "maxConcurrent": 2,
    "images": [],
    "sumupId": "14ce68be-6f8a-4462-aac0-793ec2c7b79a",
    "sumupName": "Both Legs Wax"
  },
  {
    "id": "vax-ben-armar",
    "category": "vaxning",
    "sv": "Vaxning, ben + armar",
    "en": "Legs + arms wax",
    "duration": 120,
    "price": 1200,
    "maxConcurrent": 2,
    "images": [],
    "sumupId": "4b130cd0-4dc0-40d8-a323-f4a9845f06f2",
    "sumupName": "Both legs + Both Arms Wax"
  },
  {
    "id": "vax-armhalor",
    "category": "vaxning",
    "sv": "Vaxning, armhålor",
    "en": "Underarm wax",
    "duration": 45,
    "price": 250,
    "maxConcurrent": 2,
    "images": [],
    "sumupId": "74f305e0-6422-4b91-acdf-4acdf2b3efab",
    "sumupName": "Underarms wax"
  },
  {
    "id": "vax-ansikte",
    "category": "vaxning",
    "sv": "Ansiktsvaxning",
    "en": "Face wax",
    "duration": 45,
    "price": 300,
    "maxConcurrent": 2,
    "images": [],
    "sumupId": "0a7c9fc9-d3ff-4095-882f-0ec685d9b601",
    "sumupName": "Face Wax"
  },
  {
    "id": "trad-ansikte",
    "category": "vaxning",
    "sv": "Ansiktshår med tråd (hela ansiktet, utan bryn)",
    "en": "Facial hair removal with thread (full face, excl. brows)",
    "duration": 30,
    "price": 250,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_5RMAC56F8W9E5VGXFSHRH7YZ2Q.jpg"
    ],
    "sumupId": "7f595f31-bcb2-4c74-90ef-2789d977d2c8",
    "sumupName": "Facial hair remove with thread  ( Full Face without Eyebrows shap)"
  },
  {
    "id": "henna",
    "category": "henna",
    "sv": "Henna (en hand)",
    "en": "Henna (one hand)",
    "duration": 45,
    "price": 100,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_0Z56TB48KM92ZVDKCTN3SR6357.jpg"
    ],
    "sumupId": "0eeff0d1-f647-495e-9142-f86034cb47c6",
    "sumupName": "Henna (one hand)"
  },
  {
    "id": "henna-tatuering",
    "category": "henna",
    "sv": "Henna-tatuering, en hand (enkel)",
    "en": "Henna tattoo, one hand (simple)",
    "duration": 30,
    "price": 100,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_2G3Z9A156N82JA0ERQ03A3FQD0.jpg"
    ],
    "sumupId": "db2ab32f-ee63-4d98-afb0-7016c02a786e",
    "sumupName": "One hand Henna  Teto (Simple)"
  },
  {
    "id": "ansiktsbehandling",
    "category": "ansikte",
    "sv": "Enkel ansiktsbehandling",
    "en": "Simple facial",
    "duration": 45,
    "price": 600,
    "maxConcurrent": 2,
    "images": [
      "assets/services/img_4WM65T5WKQ8R48RN68ARGQDG4E.jpg"
    ],
    "sumupId": "6e4d6460-9c7b-40f1-a927-040b5cf8d0a6",
    "sumupName": "Simple Facial"
  }
];

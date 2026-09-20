// Mirror of js/services.js — keep in sync (npm run check-sync).
export const SERVICES = [
  {
    "id": "barn",
    "category": "klippning",
    "sv": "Barnklippning (5–12 år)",
    "en": "Kids' haircut (5–12 yrs)",
    "duration": 45,
    "price": 200,
    "maxConcurrent": 2
  },
  {
    "id": "damklippning-axellangt-har",
    "category": "klippning",
    "sv": "Damklippning, axellångt hår",
    "en": "Women’s haircut, medium",
    "duration": 45,
    "price": 300,
    "maxConcurrent": 2
  },
  {
    "id": "damklippning-extra-langt-har",
    "category": "klippning",
    "sv": "Damklippning, extra långt hår",
    "en": "Women’s haircut, extra long",
    "duration": 75,
    "price": 450,
    "maxConcurrent": 2
  },
  {
    "id": "damklippning-kort-har",
    "category": "klippning",
    "sv": "Damklippning, kort hår",
    "en": "Women’s haircut, short",
    "duration": 45,
    "price": 250,
    "maxConcurrent": 2
  },
  {
    "id": "damklippning-langt-har",
    "category": "klippning",
    "sv": "Damklippning, långt hår",
    "en": "Women’s haircut, long",
    "duration": 60,
    "price": 350,
    "maxConcurrent": 2
  },
  {
    "id": "herrklippning-fade",
    "category": "klippning",
    "sv": "Herrklippning, fade",
    "en": "Men’s fade haircut",
    "duration": 45,
    "price": 250,
    "maxConcurrent": 2
  },
  {
    "id": "herrklippning-klassisk",
    "category": "klippning",
    "sv": "Herrklippning, klassisk",
    "en": "Men’s classic haircut",
    "duration": 45,
    "price": 250,
    "maxConcurrent": 2
  },
  {
    "id": "layer-cut-kort-axellangt-har",
    "category": "klippning",
    "sv": "Layer cut, kort/axellångt hår",
    "en": "Layer cut, short/medium",
    "duration": 60,
    "price": 400,
    "maxConcurrent": 2
  },
  {
    "id": "layer-cut-langt-extra-langt-har",
    "category": "klippning",
    "sv": "Layer cut, långt/extra långt hår",
    "en": "Layer cut, long/extra long",
    "duration": 75,
    "price": 500,
    "maxConcurrent": 2
  },
  {
    "id": "skaggtrimning",
    "category": "klippning",
    "sv": "Skäggtrimning",
    "en": "Beard trimming",
    "duration": 20,
    "price": 150,
    "maxConcurrent": 2
  },
  {
    "id": "balayage-toning",
    "category": "farg",
    "sv": "Balayage + toning",
    "en": "Balayage + toner",
    "duration": 270,
    "price": 1500,
    "maxConcurrent": 1
  },
  {
    "id": "blekning",
    "category": "farg",
    "sv": "Blekning",
    "en": "Bleaching",
    "duration": 180,
    "price": 1000,
    "maxConcurrent": 1
  },
  {
    "id": "global-farg-axellangt-har",
    "category": "farg",
    "sv": "Global färg, axellångt hår",
    "en": "All-over colour, medium",
    "duration": 120,
    "price": 1000,
    "maxConcurrent": 1
  },
  {
    "id": "global-farg-kort-har",
    "category": "farg",
    "sv": "Global färg, kort hår",
    "en": "All-over colour, short",
    "duration": 105,
    "price": 900,
    "maxConcurrent": 1
  },
  {
    "id": "global-farg-langt-har",
    "category": "farg",
    "sv": "Global färg, långt hår",
    "en": "All-over colour, long",
    "duration": 150,
    "price": 1200,
    "maxConcurrent": 1
  },
  {
    "id": "ombre",
    "category": "farg",
    "sv": "Ombre",
    "en": "Ombre",
    "duration": 240,
    "price": 1500,
    "maxConcurrent": 1
  },
  {
    "id": "slingor-halvt-huvud",
    "category": "farg",
    "sv": "Slingor, halvt huvud",
    "en": "Highlights, half head",
    "duration": 180,
    "price": 1200,
    "maxConcurrent": 1
  },
  {
    "id": "slingor-helt-huvud",
    "category": "farg",
    "sv": "Slingor, helt huvud",
    "en": "Highlights, full head",
    "duration": 270,
    "price": 1600,
    "maxConcurrent": 1
  },
  {
    "id": "toning-glansfarg",
    "category": "farg",
    "sv": "Toning / glansfärg",
    "en": "Toner / gloss",
    "duration": 60,
    "price": 500,
    "maxConcurrent": 1
  },
  {
    "id": "utvaxtfarg",
    "category": "farg",
    "sv": "Utväxtfärg",
    "en": "Root colour",
    "duration": 90,
    "price": 700,
    "maxConcurrent": 1
  },
  {
    "id": "balayage-toning-paket",
    "category": "farg",
    "sv": "Balayage + toning (paket)",
    "en": "Balayage + toner (package)",
    "duration": 300,
    "price": 1800,
    "maxConcurrent": 1
  },
  {
    "id": "farg-toning",
    "category": "farg",
    "sv": "Färg + toning",
    "en": "Colour + toner",
    "duration": 150,
    "price": 999,
    "maxConcurrent": 1
  },
  {
    "id": "global-farg-klippning",
    "category": "farg",
    "sv": "Global färg + klippning",
    "en": "All-over colour + cut",
    "duration": 165,
    "price": 1200,
    "maxConcurrent": 1
  },
  {
    "id": "utvaxtfarg-klippning",
    "category": "farg",
    "sv": "Utväxtfärg + klippning",
    "en": "Root colour + cut",
    "duration": 135,
    "price": 900,
    "maxConcurrent": 1
  },
  {
    "id": "keratinbehandling-axellangt-har",
    "category": "behandling",
    "sv": "Keratinbehandling, axellångt hår",
    "en": "Keratin treatment, medium",
    "duration": 300,
    "price": 2000,
    "maxConcurrent": 1
  },
  {
    "id": "keratinbehandling-extra-langt-har",
    "category": "behandling",
    "sv": "Keratinbehandling, extra långt hår",
    "en": "Keratin treatment, extra long",
    "duration": 420,
    "price": 3500,
    "maxConcurrent": 1
  },
  {
    "id": "keratinbehandling-kort-har",
    "category": "behandling",
    "sv": "Keratinbehandling, kort hår",
    "en": "Keratin treatment, short",
    "duration": 240,
    "price": 1500,
    "maxConcurrent": 1
  },
  {
    "id": "keratinbehandling-langt-har",
    "category": "behandling",
    "sv": "Keratinbehandling, långt hår",
    "en": "Keratin treatment, long",
    "duration": 360,
    "price": 2800,
    "maxConcurrent": 1
  },
  {
    "id": "olaplex-bond-builder",
    "category": "behandling",
    "sv": "Olaplex (bond builder)",
    "en": "Olaplex (bond builder)",
    "duration": 45,
    "price": 900,
    "maxConcurrent": 1
  },
  {
    "id": "permanent",
    "category": "behandling",
    "sv": "Permanent / lockar, axellångt hår",
    "en": "Perm / curls, shoulder-length",
    "duration": 240,
    "price": 1000,
    "maxConcurrent": 1
  },
  {
    "id": "plex-flex-behandling",
    "category": "behandling",
    "sv": "Plex flex-behandling",
    "en": "Plex flex treatment",
    "duration": 45,
    "price": 1000,
    "maxConcurrent": 1
  },
  {
    "id": "plex-behandling-extra-langt-har",
    "category": "behandling",
    "sv": "Plex-behandling, extra långt hår",
    "en": "Plex treatment, extra long",
    "duration": 75,
    "price": 2200,
    "maxConcurrent": 1
  },
  {
    "id": "plex-behandling-kort-har",
    "category": "behandling",
    "sv": "Plex-behandling, kort hår",
    "en": "Plex treatment, short",
    "duration": 45,
    "price": 1200,
    "maxConcurrent": 1
  },
  {
    "id": "plex-behandling-langt-har",
    "category": "behandling",
    "sv": "Plex-behandling, långt hår",
    "en": "Plex treatment, long",
    "duration": 60,
    "price": 1800,
    "maxConcurrent": 1
  },
  {
    "id": "proteinbehandling-axellangt-har",
    "category": "behandling",
    "sv": "Proteinbehandling, axellångt hår",
    "en": "Protein treatment, medium",
    "duration": 180,
    "price": 1200,
    "maxConcurrent": 1
  },
  {
    "id": "proteinbehandling-extra-langt-har",
    "category": "behandling",
    "sv": "Proteinbehandling, extra långt hår",
    "en": "Protein treatment, extra long",
    "duration": 300,
    "price": 2000,
    "maxConcurrent": 1
  },
  {
    "id": "proteinbehandling-kort-har",
    "category": "behandling",
    "sv": "Proteinbehandling, kort hår",
    "en": "Protein treatment, short",
    "duration": 120,
    "price": 800,
    "maxConcurrent": 1
  },
  {
    "id": "proteinbehandling-langt-har",
    "category": "behandling",
    "sv": "Proteinbehandling, långt hår",
    "en": "Protein treatment, long",
    "duration": 240,
    "price": 1600,
    "maxConcurrent": 1
  },
  {
    "id": "keratin-plex-combo",
    "category": "behandling",
    "sv": "Keratin + plex combo",
    "en": "Keratin + plex combo",
    "duration": 420,
    "price": 3200,
    "maxConcurrent": 1
  },
  {
    "id": "keratinbehandling-farg",
    "category": "behandling",
    "sv": "Keratinbehandling + färg",
    "en": "Keratin treatment + colour",
    "duration": 420,
    "price": 2800,
    "maxConcurrent": 1
  },
  {
    "id": "keratinbehandling-klippning",
    "category": "behandling",
    "sv": "Keratinbehandling + klippning",
    "en": "Keratin treatment + cut",
    "duration": 300,
    "price": 2500,
    "maxConcurrent": 1
  },
  {
    "id": "plex-behandling-farg",
    "category": "behandling",
    "sv": "Plex-behandling + färg",
    "en": "Plex treatment + colour",
    "duration": 180,
    "price": 2200,
    "maxConcurrent": 1
  },
  {
    "id": "plex-behandling-klippning",
    "category": "behandling",
    "sv": "Plex-behandling + klippning",
    "en": "Plex treatment + cut",
    "duration": 105,
    "price": 1700,
    "maxConcurrent": 1
  },
  {
    "id": "protein-keratin-combo",
    "category": "behandling",
    "sv": "Protein + keratin combo",
    "en": "Protein + keratin combo",
    "duration": 420,
    "price": 3500,
    "maxConcurrent": 1
  },
  {
    "id": "proteinbehandling-farg",
    "category": "behandling",
    "sv": "Proteinbehandling + färg",
    "en": "Protein treatment + colour",
    "duration": 300,
    "price": 1800,
    "maxConcurrent": 1
  },
  {
    "id": "proteinbehandling-klippning",
    "category": "behandling",
    "sv": "Proteinbehandling + klippning",
    "en": "Protein treatment + cut",
    "duration": 225,
    "price": 1500,
    "maxConcurrent": 1
  },
  {
    "id": "tvatt-fon",
    "category": "styling",
    "sv": "Hårtvätt & fön, axellångt hår",
    "en": "Wash & blow-dry, shoulder-length",
    "duration": 60,
    "price": 300,
    "maxConcurrent": 2
  },
  {
    "id": "plattang-rakt",
    "category": "styling",
    "sv": "Plattång, rak styling, kort hår",
    "en": "Straight styling, short hair",
    "duration": 45,
    "price": 300,
    "maxConcurrent": 2
  },
  {
    "id": "plattang-lockar",
    "category": "styling",
    "sv": "Plattångslockar, kort hår",
    "en": "Straightener curls, short hair",
    "duration": 45,
    "price": 300,
    "maxConcurrent": 2
  },
  {
    "id": "builder-gel-med-gellack",
    "category": "naglar",
    "sv": "Builder gel med gellack",
    "en": "Builder gel with gel polish",
    "duration": 105,
    "price": 550,
    "maxConcurrent": 2
  },
  {
    "id": "builder-gel-pa-naturliga-naglar",
    "category": "naglar",
    "sv": "Builder gel på naturliga naglar",
    "en": "Builder gel on natural nails",
    "duration": 90,
    "price": 450,
    "maxConcurrent": 2
  },
  {
    "id": "gellack-med-enkel-nail-art",
    "category": "naglar",
    "sv": "Gellack med enkel nail art",
    "en": "Gel polish with simple nail art",
    "duration": 60,
    "price": 350,
    "maxConcurrent": 2
  },
  {
    "id": "gellack-enfargad",
    "category": "naglar",
    "sv": "Gellack, enfärgad",
    "en": "Gel polish, single colour",
    "duration": 45,
    "price": 300,
    "maxConcurrent": 2
  },
  {
    "id": "klassisk-manikyr",
    "category": "naglar",
    "sv": "Klassisk manikyr",
    "en": "Classic manicure",
    "duration": 45,
    "price": 250,
    "maxConcurrent": 2
  },
  {
    "id": "manikyr-med-gellack",
    "category": "naglar",
    "sv": "Manikyr med gellack",
    "en": "Manicure with gel polish",
    "duration": 60,
    "price": 350,
    "maxConcurrent": 2
  },
  {
    "id": "nail-art-avancerad-design",
    "category": "naglar",
    "sv": "Nail art, avancerad design",
    "en": "Nail art, advanced design",
    "duration": 30,
    "price": 100,
    "maxConcurrent": 2
  },
  {
    "id": "nail-art-enkel-design",
    "category": "naglar",
    "sv": "Nail art, enkel design",
    "en": "Nail art, simple design",
    "duration": 15,
    "price": 50,
    "maxConcurrent": 2
  },
  {
    "id": "nytt-set-kort-langd",
    "category": "naglar",
    "sv": "Nytt set, kort längd",
    "en": "New set, short",
    "duration": 90,
    "price": 450,
    "maxConcurrent": 2
  },
  {
    "id": "nytt-set-lang-langd",
    "category": "naglar",
    "sv": "Nytt set, lång längd",
    "en": "New set, long",
    "duration": 120,
    "price": 650,
    "maxConcurrent": 2
  },
  {
    "id": "nytt-set-medium-langd",
    "category": "naglar",
    "sv": "Nytt set, medium längd",
    "en": "New set, medium",
    "duration": 105,
    "price": 550,
    "maxConcurrent": 2
  },
  {
    "id": "pafyllning-inom-3-veckor",
    "category": "naglar",
    "sv": "Påfyllning inom 3 veckor",
    "en": "Infill within 3 weeks",
    "duration": 75,
    "price": 400,
    "maxConcurrent": 2
  },
  {
    "id": "pafyllning-inom-4-veckor",
    "category": "naglar",
    "sv": "Påfyllning inom 4 veckor",
    "en": "Infill within 4 weeks",
    "duration": 90,
    "price": 500,
    "maxConcurrent": 2
  },
  {
    "id": "browlift",
    "category": "bryn",
    "sv": "Browlift",
    "en": "Brow lift",
    "duration": 60,
    "price": 450,
    "maxConcurrent": 2
  },
  {
    "id": "lashlift",
    "category": "bryn",
    "sv": "Lashlift",
    "en": "Lash lift",
    "duration": 60,
    "price": 450,
    "maxConcurrent": 2
  },
  {
    "id": "tradning-hela-ansiktet",
    "category": "bryn",
    "sv": "Trådning hela ansiktet",
    "en": "Full face threading",
    "duration": 30,
    "price": 300,
    "maxConcurrent": 2
  },
  {
    "id": "tradning-overlapp",
    "category": "bryn",
    "sv": "Trådning överläpp",
    "en": "Upper lip threading",
    "duration": 10,
    "price": 100,
    "maxConcurrent": 2
  },
  {
    "id": "ogonbrynsformning",
    "category": "bryn",
    "sv": "Ögonbrynsformning",
    "en": "Eyebrow shaping",
    "duration": 15,
    "price": 150,
    "maxConcurrent": 2
  },
  {
    "id": "bryn-farg",
    "category": "bryn",
    "sv": "Ögonbrynsformning + färg",
    "en": "Eyebrow shaping + tint",
    "duration": 45,
    "price": 250,
    "maxConcurrent": 2
  },
  {
    "id": "ansiktsvaxning-hela-ansiktet",
    "category": "vaxning",
    "sv": "Ansiktsvaxning, hela ansiktet",
    "en": "Full face wax",
    "duration": 45,
    "price": 300,
    "maxConcurrent": 2
  },
  {
    "id": "armhalsvaxning",
    "category": "vaxning",
    "sv": "Armhålsvaxning",
    "en": "Underarm wax",
    "duration": 20,
    "price": 150,
    "maxConcurrent": 2
  },
  {
    "id": "hakvaxning",
    "category": "vaxning",
    "sv": "Hakvaxning",
    "en": "Chin wax",
    "duration": 15,
    "price": 100,
    "maxConcurrent": 2
  },
  {
    "id": "magvaxning",
    "category": "vaxning",
    "sv": "Magvaxning",
    "en": "Stomach wax",
    "duration": 30,
    "price": 250,
    "maxConcurrent": 2
  },
  {
    "id": "pannvaxning",
    "category": "vaxning",
    "sv": "Pannvaxning",
    "en": "Forehead wax",
    "duration": 15,
    "price": 100,
    "maxConcurrent": 2
  },
  {
    "id": "ryggvaxning",
    "category": "vaxning",
    "sv": "Ryggvaxning",
    "en": "Back wax",
    "duration": 45,
    "price": 350,
    "maxConcurrent": 2
  },
  {
    "id": "vaxning-bada-fulla-armar",
    "category": "vaxning",
    "sv": "Vaxning, båda fulla armar",
    "en": "Both full arms wax",
    "duration": 60,
    "price": 400,
    "maxConcurrent": 2
  },
  {
    "id": "vax-arm",
    "category": "vaxning",
    "sv": "Vaxning, en hel arm",
    "en": "One full arm wax",
    "duration": 45,
    "price": 300,
    "maxConcurrent": 2
  },
  {
    "id": "vaxning-fulla-ben",
    "category": "vaxning",
    "sv": "Vaxning, fulla ben",
    "en": "Full legs wax",
    "duration": 90,
    "price": 500,
    "maxConcurrent": 2
  },
  {
    "id": "vaxning-halva-armar",
    "category": "vaxning",
    "sv": "Vaxning, halva armar",
    "en": "Half arms wax",
    "duration": 30,
    "price": 200,
    "maxConcurrent": 2
  },
  {
    "id": "vaxning-halva-ben",
    "category": "vaxning",
    "sv": "Vaxning, halva ben",
    "en": "Half legs wax",
    "duration": 45,
    "price": 250,
    "maxConcurrent": 2
  },
  {
    "id": "overlappsvaxning",
    "category": "vaxning",
    "sv": "Överläppsvaxning",
    "en": "Upper lip wax",
    "duration": 15,
    "price": 100,
    "maxConcurrent": 2
  },
  {
    "id": "ansikte-plus-hela-ansiktet-brynformning",
    "category": "vaxning",
    "sv": "Ansikte plus: hela ansiktet + brynformning",
    "en": "Face plus: full face + brow shape",
    "duration": 60,
    "price": 350,
    "maxConcurrent": 2
  },
  {
    "id": "ansiktspaket-overlapp-haka-panna",
    "category": "vaxning",
    "sv": "Ansiktspaket: överläpp + haka + panna",
    "en": "Face package: lip + chin + forehead",
    "duration": 45,
    "price": 250,
    "maxConcurrent": 2
  },
  {
    "id": "arm-ben-combo-bada-fulla-armar-fulla-ben",
    "category": "vaxning",
    "sv": "Arm & ben combo: båda fulla armar + fulla ben",
    "en": "Arm & leg combo: both full arms + full legs",
    "duration": 120,
    "price": 750,
    "maxConcurrent": 2
  },
  {
    "id": "armpaket-bada-fulla-armar-armhalor",
    "category": "vaxning",
    "sv": "Armpaket: båda fulla armar + armhålor",
    "en": "Arm package: both full arms + underarms",
    "duration": 75,
    "price": 500,
    "maxConcurrent": 2
  },
  {
    "id": "benpaket-fulla-ben-armhalor",
    "category": "vaxning",
    "sv": "Benpaket: fulla ben + armhålor",
    "en": "Leg package: full legs + underarms",
    "duration": 105,
    "price": 600,
    "maxConcurrent": 2
  },
  {
    "id": "ansiktsmask",
    "category": "ansikte",
    "sv": "Ansiktsmask",
    "en": "Face mask",
    "duration": 20,
    "price": 150,
    "maxConcurrent": 2
  },
  {
    "id": "ansiktsmassage",
    "category": "ansikte",
    "sv": "Ansiktsmassage",
    "en": "Face massage",
    "duration": 30,
    "price": 250,
    "maxConcurrent": 2
  },
  {
    "id": "anti-aging-facial",
    "category": "ansikte",
    "sv": "Anti-aging facial",
    "en": "Anti-ageing facial",
    "duration": 75,
    "price": 900,
    "maxConcurrent": 2
  },
  {
    "id": "blackhead-removal",
    "category": "ansikte",
    "sv": "Blackhead removal",
    "en": "Blackhead removal",
    "duration": 30,
    "price": 200,
    "maxConcurrent": 2
  },
  {
    "id": "clean-up-facial",
    "category": "ansikte",
    "sv": "Clean up facial",
    "en": "Clean up facial",
    "duration": 30,
    "price": 350,
    "maxConcurrent": 2
  },
  {
    "id": "de-tan-facial",
    "category": "ansikte",
    "sv": "De-tan facial",
    "en": "De-tan facial",
    "duration": 60,
    "price": 700,
    "maxConcurrent": 2
  },
  {
    "id": "deep-cleansing-facial",
    "category": "ansikte",
    "sv": "Deep cleansing facial",
    "en": "Deep cleansing facial",
    "duration": 75,
    "price": 950,
    "maxConcurrent": 2
  },
  {
    "id": "fruit-facial",
    "category": "ansikte",
    "sv": "Fruit facial",
    "en": "Fruit facial",
    "duration": 45,
    "price": 500,
    "maxConcurrent": 2
  },
  {
    "id": "gold-facial",
    "category": "ansikte",
    "sv": "Gold facial",
    "en": "Gold facial",
    "duration": 60,
    "price": 800,
    "maxConcurrent": 2
  },
  {
    "id": "hydrating-facial",
    "category": "ansikte",
    "sv": "Hydrating facial",
    "en": "Hydrating facial",
    "duration": 60,
    "price": 750,
    "maxConcurrent": 2
  },
  {
    "id": "simple-facial",
    "category": "ansikte",
    "sv": "Simple facial",
    "en": "Simple facial",
    "duration": 45,
    "price": 400,
    "maxConcurrent": 2
  },
  {
    "id": "whitening-facial",
    "category": "ansikte",
    "sv": "Whitening facial",
    "en": "Whitening facial",
    "duration": 60,
    "price": 700,
    "maxConcurrent": 2
  },
  {
    "id": "complete-facial-paket",
    "category": "ansikte",
    "sv": "Complete facial-paket",
    "en": "Complete facial package",
    "duration": 120,
    "price": 1200,
    "maxConcurrent": 2
  },
  {
    "id": "gold-facial-ansiktsmassage",
    "category": "ansikte",
    "sv": "Gold facial + ansiktsmassage",
    "en": "Gold facial + face massage",
    "duration": 90,
    "price": 950,
    "maxConcurrent": 2
  },
  {
    "id": "simple-facial-ansiktsmassage",
    "category": "ansikte",
    "sv": "Simple facial + ansiktsmassage",
    "en": "Simple facial + face massage",
    "duration": 75,
    "price": 550,
    "maxConcurrent": 2
  },
  {
    "id": "whitening-facial-bryn",
    "category": "ansikte",
    "sv": "Whitening facial + bryn",
    "en": "Whitening facial + brows",
    "duration": 75,
    "price": 800,
    "maxConcurrent": 2
  },
  {
    "id": "henna",
    "category": "henna",
    "sv": "Henna (en hand)",
    "en": "Henna (one hand)",
    "duration": 45,
    "price": 100,
    "maxConcurrent": 2
  },
  {
    "id": "henna-tatuering",
    "category": "henna",
    "sv": "Henna-tatuering, en hand (enkel)",
    "en": "Henna tattoo, one hand (simple)",
    "duration": 30,
    "price": 100,
    "maxConcurrent": 2
  }
];

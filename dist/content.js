(()=>{"use strict";const t=t=>"object"==typeof t&&null!==t,e=({structuredDataList:t})=>{const e=t.flatMap((t=>{if(!("@type"in t))return[];const e=t["@type"];return"Article"===e||"AdvertiserContentArticle"===e||"NewsArticle"===e||"AnalysisNewsArticle"===e||"AskPublicNewsArticle"===e||"BackgroundNewsArticle"===e||"OpinionNewsArticle"===e||"ReportageNewsArticle"===e||"ReviewNewsArticle"===e||"Report"===e||"SatiricalArticle"===e||"ScholarlyArticle"===e||"MedicalScholarlyArticle"===e||"SocialMediaPosting"===e||"BlogPosting"===e||"LiveBlogPosting"===e||"DiscussionForumPosting"===e||"TechArticle"===e||"APIReference"===e?[t]:[]}));if(!(e.length<1))return e[0]},r=({structuredDataList:t})=>{const e=t.flatMap((t=>{if(!("@type"in t))return[];const e=t["@type"];return"Event"===e||"BusinessEvent"===e||"ChildrensEvent"===e||"ComedyEvent"===e||"CourseInstance"===e||"DanceEvent"===e||"DeliveryEvent"===e||"EducationEvent"===e||"EventSeries"===e||"ExhibitionEvent"===e||"Festival"===e||"FoodEvent"===e||"Hackathon"===e||"LiteraryEvent"===e||"MusicEvent"===e||"PublicationEvent"===e||"BroadcastEvent"===e||"OnDemandEvent"===e||"SaleEvent"===e||"ScreeningEvent"===e||"SocialEvent"===e||"SportsEvent"===e||"TheaterEvent"===e||"UserInteraction"===e||"UserBlocks"===e||"UserCheckins"===e||"UserComments"===e||"UserDownloads"===e||"UserLikes"===e||"UserPageVisits"===e||"UserPlays"===e||"UserPlusOnes"===e||"UserTweets"===e||"VisualArtsEvent"===e?[t]:[]}));if(!(e.length<1))return e[0]},i=({structuredDataList:t})=>{const e=t.flatMap((t=>{if(!("@type"in t))return[];const e=t["@type"];return"Product"===e||"IndividualProduct"===e||"ProductCollection"===e||"ProductGroup"===e||"ProductModel"===e||"SomeProducts"===e||"Vehicle"===e||"BusOrCoach"===e||"Car"===e||"Motorcycle"===e||"MotorizedBicycle"===e?[t]:[]}));if(!(e.length<1))return e[0]},o=({structuredDataList:t})=>{const e=t.flatMap((t=>{if(!("@type"in t))return[];const e=t["@type"];return"LocalBusiness"===e||"AnimalShelter"===e||"ArchiveOrganization"===e||"AutomotiveBusiness"===e||"AutoBodyShop"===e||"AutoDealer"===e||"AutoPartsStore"===e||"AutoRental"===e||"AutoRepair"===e||"AutoWash"===e||"GasStation"===e||"MotorcycleDealer"===e||"MotorcycleRepair"===e||"ChildCare"===e||"Dentist"===e||"DryCleaningOrLaundry"===e||"EmergencyService"===e||"FireStation"===e||"Hospital"===e||"PoliceStation"===e||"EmploymentAgency"===e||"EntertainmentBusiness"===e||"AdultEntertainment"===e||"AmusementPark"===e||"ArtGallery"===e||"Casino"===e||"ComedyClub"===e||"MovieTheater"===e||"NightClub"===e||"FinancialService"===e||"AccountingService"===e||"AutomatedTeller"===e||"BankOrCreditUnion"===e||"InsuranceAgency"===e||"FoodEstablishment"===e||"Bakery"===e||"BarOrPub"===e||"Brewery"===e||"CafeOrCoffeeShop"===e||"Distillery"===e||"FastFoodRestaurant"===e||"IceCreamShop"===e||"Restaurant"===e||"Winery"===e||"GovernmentOffice"===e||"PostOffice"===e||"HealthAndBeautyBusiness"===e||"BeautySalon"===e||"DaySpa"===e||"HairSalon"===e||"HealthClub"===e||"NailSalon"===e||"TattooParlor"===e||"HomeAndConstructionBusiness"===e||"Electrician"===e||"GeneralContractor"===e||"HVACBusiness"===e||"HousePainter"===e||"Locksmith"===e||"MovingCompany"===e||"Plumber"===e||"RoofingContractor"===e||"InternetCafe"===e||"LegalService"===e||"Attorney"===e||"Notary"===e||"Library"===e||"LodgingBusiness"===e||"BedAndBreakfast"===e||"Campground"===e||"Hostel"===e||"Hotel"===e||"Motel"===e||"Resort"===e||"SkiResort"===e||"MedicalBusiness"===e||"CommunityHealth"===e||"Dentist"===e||"Dermatology"===e||"DietNutrition"===e||"Emergency"===e||"Geriatric"===e||"Gynecologic"===e||"MedicalClinic"===e||"CovidTestingFacility"===e||"Midwifery"===e||"Nursing"===e||"Obstetric"===e||"Oncologic"===e||"Optician"===e||"Optometric"===e||"Otolaryngologic"===e||"Pediatric"===e||"Pharmacy"===e||"Physician"===e||"Physiotherapy"===e||"PlasticSurgery"===e||"Podiatric"===e||"PrimaryCare"===e||"Psychiatric"===e||"PublicHealth"===e||"ProfessionalService"===e||"RadioStation"===e||"RealEstateAgent"===e||"RecyclingCenter"===e||"SelfStorage"===e||"ShoppingCenter"===e||"SportsActivityLocation"===e||"BowlingAlley"===e||"ExerciseGym"===e||"GolfCourse"===e||"HealthClub"===e||"PublicSwimmingPool"===e||"SkiResort"===e||"SportsClub"===e||"StadiumOrArena"===e||"TennisComplex"===e||"Store"===e||"AutoPartsStore"===e||"BikeStore"===e||"BookStore"===e||"ClothingStore"===e||"ComputerStore"===e||"ConvenienceStore"===e||"DepartmentStore"===e||"ElectronicsStore"===e||"Florist"===e||"FurnitureStore"===e||"GardenStore"===e||"GroceryStore"===e||"HardwareStore"===e||"HobbyShop"===e||"HomeGoodsStore"===e||"JewelryStore"===e||"LiquorStore"===e||"MensClothingStore"===e||"MobilePhoneStore"===e||"MovieRentalStore"===e||"MusicStore"===e||"OfficeEquipmentStore"===e||"OutletStore"===e||"PawnShop"===e||"PetStore"===e||"ShoeStore"===e||"SportingGoodsStore"===e||"TireShop"===e||"ToyStore"===e||"WholesaleStore"===e||"TelevisionStation"===e||"TouristInformationCenter"===e||"TravelAgency"===e?[t]:[]}));if(!(e.length<1))return e[0]},n=({structuredDataList:t})=>{const e=t.flatMap((t=>{if(!("@type"in t))return[];const e=t["@type"];return"VideoObject"===e||"VideoObjectSnapshot"===e?[t]:[]}));if(!(e.length<1))return e[0]},a=t=>t.replace("http://schema.org/","").replace("https://schema.org/",""),s=t=>("number"==typeof t.latitude||"string"==typeof t.latitude)&&("number"==typeof t.longitude||"string"==typeof t.longitude)&&`[N${t.latitude},E${t.longitude}]`,c=({structuredDataList:t})=>(({structuredDataList:t})=>t.flatMap((t=>"@type"in t&&"BreadcrumbList"===t["@type"]?[t]:[])))({structuredDataList:t}).flatMap((t=>{const{itemListElement:e}=t;return Array.isArray(e)?[[...e].sort(((t,e)=>t.position-e.position)).flatMap((t=>{if(!t)return[];const e=t.item?.name??t.name;return"string"==typeof e?[`[${e}]`]:[]})).join(" > ")]:[]})).join("\n"),l=({structuredDataList:i})=>{const o=r({structuredDataList:i}),n=o?.performer,a=o?.organizer,s=e({structuredDataList:i}),c=s?.author,l=s?.publisher,u=[...new Set([t(n)&&n.name,t(a)&&a.name,t(c)&&c.name,t(l)&&l.name,,...[...document.querySelectorAll('meta[name="author" i], meta[name="creator" i], meta[name="publisher" i]')].flatMap((t=>t instanceof HTMLMetaElement?[t.content]:[]))].flatMap((t=>"string"==typeof t?[t]:[])))];return u.length>=1&&`by ${u.map((t=>`[${t}]`)).join(" ")}`},u=({structuredDataList:t})=>{const r=e({structuredDataList:t}),i=r?.dateModified??r?.datePublished;return"string"==typeof i&&i},y=({structuredDataList:t})=>{const o=document.querySelector('meta[name="description" i]'),a=document.querySelector('meta[property="og:description" i]'),s=r({structuredDataList:t})?.description,c=i({structuredDataList:t})?.description,l=n({structuredDataList:t})?.description,u=e({structuredDataList:t})?.headline;return"string"==typeof s&&s||"string"==typeof c&&c||"string"==typeof l&&l||"string"==typeof u&&u||a instanceof HTMLMetaElement&&a.content||o instanceof HTMLMetaElement&&o.content},d=({structuredDataList:e})=>{const c=[],l=r({structuredDataList:e});if(l){const{endDate:e,location:r,offers:i,startDate:o}=l,n=Array.isArray(i)?i[0]:i;c.push([t(r)&&"name"in r&&`at [${r.name}]`,t(r)&&t(r.address)&&f(r.address),t(r)&&r.geo&&"latitude"in r.geo&&s(r.geo),t(r)&&r.url,`${o??""} ~ ${e??""}`,...n?g(n):[]])}const u=o({structuredDataList:e});if(u){const{address:e,geo:r,openingHoursSpecification:i,priceRange:o,telephone:n}=u,l=Array.isArray(i)&&i||t(i)&&[i];c.push([t(e)&&f(e),r&&"latitude"in r&&s(r),...l?l.map((t=>[(t.opens||t.closes)&&`${t.opens??""} ~ ${t.closes??""}`,t.dayOfWeek?.map(a).join(", "),(t.validFrom||t.validThrough)&&`${t.validFrom??""} ~ ${t.validThrough??""}`].filter((t=>t)).join(" "))):[],"string"==typeof o&&o,"string"==typeof n&&n])}const y=i({structuredDataList:e});if(y){const{brand:e,offers:r}=y,i=Array.isArray(r)?r[0]:r;c.push([t(e)&&`[${e.name}] brand`,...i?g(i):[]])}const d=n({structuredDataList:e});if(d){const{duration:e,expires:r,hasPart:i,publication:o,uploadDate:n}=d,a=Array.isArray(i)?i:[];c.push([`${n??""} ~ ${r??""}`,t(o)&&o.isLiveBroadcast&&`Live ${o.startDate??""} ~ ${o.endDate??""}`,"string"==typeof e&&e,...a.map((t=>`${t.name} ${t.startOffset?`${t.startOffset} s`:""} ~ ${t.endOffset?`${t.endOffset} s`:""} ${t.url}`))])}return c.map((t=>t.filter((t=>"string"==typeof t)).join("\n"))).filter((t=>t)).join("\n\n")},p=()=>{const t=document.querySelector('meta[name="keywords" i]');return(t instanceof HTMLMetaElement&&t.content||"").split(",").flatMap((t=>{const e=t.trim();return""===e?[]:[e]})).map(S).join(" ")},m=({structuredDataList:t})=>{const a=r({structuredDataList:t})?.name,s=o({structuredDataList:t})?.name,c=i({structuredDataList:t})?.name,l=n({structuredDataList:t})?.name,u=e({structuredDataList:t})?.headline;return"string"==typeof a&&a||"string"==typeof s&&s||"string"==typeof c&&c||"string"==typeof l&&l||"string"==typeof u&&u||document.title},g=t=>["price"in t&&("number"==typeof t.price||"string"==typeof t.price)&&`${t.price} ${"string"==typeof t.priceCurrency?t.priceCurrency:""}`,"lowPrice"in t&&("number"==typeof t.lowPrice||"string"==typeof t.lowPrice)&&"string"==typeof t.priceCurrency&&`${t.lowPrice} ${"number"==typeof t.highPrice||"string"==typeof t.highPrice?`~ ${t.highPrice} `:""}${t.priceCurrency}`,"availability"in t&&"string"==typeof t.availability&&a(t.availability),"itemCondition"in t&&"string"==typeof t.itemCondition&&a(t.itemCondition),"offerCount"in t&&"number"==typeof t.offerCount&&`${t.offerCount} left`,"priceValidUntil"in t&&"string"==typeof t.priceValidUntil&&`until ${t.priceValidUntil}`],f=t=>[t.streetAddress,t.addressLocality,t.addressRegion,t.postalCode,t.addressCountry].flatMap((t=>"string"==typeof t?[`[${t}]`]:[])).join(", "),S=t=>`#${t.replaceAll(" ","_")}`,h=()=>{const o=[...document.querySelectorAll('script[type="application/ld+json" i]')].flatMap((e=>{if(!(e instanceof HTMLScriptElement))return[];try{const r=JSON.parse(e.innerText);return(Array.isArray(r)?r:[r]).flatMap((e=>{return t(r=e)&&["http://schema.org","http://schema.org/","https://schema.org","https://schema.org/"].includes(r["@context"])?[e]:[];var r}))}catch(t){return console.error(t),[]}})),a=location.href,s=document.querySelector('meta[property="og:image" i]'),g=document.querySelector('link[rel="icon" i]'),f=s instanceof HTMLMetaElement&&s.content||(({structuredDataList:o})=>{const a=r({structuredDataList:o});if(a){const{image:t}=a,e=Array.isArray(t)?t[0]:t;if("string"==typeof e)return e}const s=i({structuredDataList:o});if(s){const{image:t}=s,e=Array.isArray(t)?t[0]:t;if("string"==typeof e)return e}const c=n({structuredDataList:o});if(c){const{thumbnailUrl:t}=c,e=Array.isArray(t)?t[0]:t;if("string"==typeof e)return e}const l=e({structuredDataList:o});if(l){const{image:e,publisher:r}=l,i=Array.isArray(e)?e[0]:e;if("string"==typeof i)return i;const o=t(r)&&t(r.logo)&&r.logo.url;if("string"==typeof o)return o}const u=(({structuredDataList:t})=>{const e=t.flatMap((t=>{if(!("@type"in t))return[];const e=t["@type"];return"Organization"===e||"Airline"===e||"Consortium"===e||"Corporation"===e||"EducationalOrganization"===e||"CollegeOrUniversity"===e||"ElementarySchool"===e||"HighSchool"===e||"MiddleSchool"===e||"Preschool"===e||"School"===e||"FundingScheme"===e||"GovernmentOrganization"===e||"LibrarySystem"===e||"LocalBusiness"===e||"AnimalShelter"===e||"ArchiveOrganization"===e||"AutomotiveBusiness"===e||"AutoBodyShop"===e||"AutoDealer"===e||"AutoPartsStore"===e||"AutoRental"===e||"AutoRepair"===e||"AutoWash"===e||"GasStation"===e||"MotorcycleDealer"===e||"MotorcycleRepair"===e||"ChildCare"===e||"Dentist"===e||"DryCleaningOrLaundry"===e||"EmergencyService"===e||"FireStation"===e||"Hospital"===e||"PoliceStation"===e||"EmploymentAgency"===e||"EntertainmentBusiness"===e||"AdultEntertainment"===e||"AmusementPark"===e||"ArtGallery"===e||"Casino"===e||"ComedyClub"===e||"MovieTheater"===e||"NightClub"===e||"FinancialService"===e||"AccountingService"===e||"AutomatedTeller"===e||"BankOrCreditUnion"===e||"InsuranceAgency"===e||"FoodEstablishment"===e||"Bakery"===e||"BarOrPub"===e||"Brewery"===e||"CafeOrCoffeeShop"===e||"Distillery"===e||"FastFoodRestaurant"===e||"IceCreamShop"===e||"Restaurant"===e||"Winery"===e||"GovernmentOffice"===e||"PostOffice"===e||"HealthAndBeautyBusiness"===e||"BeautySalon"===e||"DaySpa"===e||"HairSalon"===e||"HealthClub"===e||"NailSalon"===e||"TattooParlor"===e||"HomeAndConstructionBusiness"===e||"Electrician"===e||"GeneralContractor"===e||"HVACBusiness"===e||"HousePainter"===e||"Locksmith"===e||"MovingCompany"===e||"Plumber"===e||"RoofingContractor"===e||"InternetCafe"===e||"LegalService"===e||"Attorney"===e||"Notary"===e||"Library"===e||"LodgingBusiness"===e||"BedAndBreakfast"===e||"Campground"===e||"Hostel"===e||"Hotel"===e||"Motel"===e||"Resort"===e||"SkiResort"===e||"MedicalBusiness"===e||"CommunityHealth"===e||"Dentist"===e||"Dermatology"===e||"DietNutrition"===e||"Emergency"===e||"Geriatric"===e||"Gynecologic"===e||"MedicalClinic"===e||"CovidTestingFacility"===e||"Midwifery"===e||"Nursing"===e||"Obstetric"===e||"Oncologic"===e||"Optician"===e||"Optometric"===e||"Otolaryngologic"===e||"Pediatric"===e||"Pharmacy"===e||"Physician"===e||"Physiotherapy"===e||"PlasticSurgery"===e||"Podiatric"===e||"PrimaryCare"===e||"Psychiatric"===e||"PublicHealth"===e||"ProfessionalService"===e||"RadioStation"===e||"RealEstateAgent"===e||"RecyclingCenter"===e||"SelfStorage"===e||"ShoppingCenter"===e||"SportsActivityLocation"===e||"BowlingAlley"===e||"ExerciseGym"===e||"GolfCourse"===e||"HealthClub"===e||"PublicSwimmingPool"===e||"SkiResort"===e||"SportsClub"===e||"StadiumOrArena"===e||"TennisComplex"===e||"Store"===e||"AutoPartsStore"===e||"BikeStore"===e||"BookStore"===e||"ClothingStore"===e||"ComputerStore"===e||"ConvenienceStore"===e||"DepartmentStore"===e||"ElectronicsStore"===e||"Florist"===e||"FurnitureStore"===e||"GardenStore"===e||"GroceryStore"===e||"HardwareStore"===e||"HobbyShop"===e||"HomeGoodsStore"===e||"JewelryStore"===e||"LiquorStore"===e||"MensClothingStore"===e||"MobilePhoneStore"===e||"MovieRentalStore"===e||"MusicStore"===e||"OfficeEquipmentStore"===e||"OutletStore"===e||"PawnShop"===e||"PetStore"===e||"ShoeStore"===e||"SportingGoodsStore"===e||"TireShop"===e||"ToyStore"===e||"WholesaleStore"===e||"TelevisionStation"===e||"TouristInformationCenter"===e||"TravelAgency"===e||"MedicalOrganization"===e||"Dentist"===e||"DiagnosticLab"===e||"Hospital"===e||"MedicalClinic"===e||"Pharmacy"===e||"Physician"===e||"VeterinaryCare"===e||"NGO"===e||"NewsMediaOrganization"===e||"PerformingGroup"===e||"DanceGroup"===e||"MusicGroup"===e||"TheaterGroup"===e||"Project"===e||"FundingAgency"===e||"ResearchProject"===e||"ResearchOrganization"===e||"SportsOrganization"===e||"SportsTeam"===e||"WorkersUnion"===e?[t]:[]}));if(!(e.length<1))return e[0]})({structuredDataList:o});if(u){const{logo:t}=u;if("string"==typeof t)return t}})({structuredDataList:o})||g instanceof HTMLLinkElement&&g.href||void 0,S={url:a,body:`${[f&&`[${f}]`,`[${a}]`,[u({structuredDataList:o}),l({structuredDataList:o})].filter((t=>t)).join("\n"),c({structuredDataList:o}),d({structuredDataList:o}),y({structuredDataList:o}),p()].filter((t=>t)).join("\n\n").split("\n").map((t=>`> ${t}`)).join("\n")}\n\n`,title:m({structuredDataList:o})};chrome.runtime.sendMessage(S)};h(),addEventListener("load",h),setInterval(h,1e3)})();
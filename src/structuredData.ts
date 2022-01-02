import { Thing, WithContext } from "schema-dts";
import { isObject } from "./isObject";

export const getArticleStructuredData = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const articleStructuredDataList = structuredDataList.flatMap(
    (structuredData) => {
      if (!("@type" in structuredData)) {
        return [];
      }

      const type = structuredData["@type"];

      return type === "Article" ||
        type === "AdvertiserContentArticle" ||
        type === "NewsArticle" ||
        type === "AnalysisNewsArticle" ||
        type === "AskPublicNewsArticle" ||
        type === "BackgroundNewsArticle" ||
        type === "OpinionNewsArticle" ||
        type === "ReportageNewsArticle" ||
        type === "ReviewNewsArticle" ||
        type === "Report" ||
        type === "SatiricalArticle" ||
        type === "ScholarlyArticle" ||
        type === "MedicalScholarlyArticle" ||
        type === "SocialMediaPosting" ||
        type === "BlogPosting" ||
        type === "LiveBlogPosting" ||
        type === "DiscussionForumPosting" ||
        type === "TechArticle" ||
        type === "APIReference"
        ? [structuredData]
        : [];
    }
  );

  if (articleStructuredDataList.length < 1) {
    return;
  }

  return articleStructuredDataList[0];
};

export const getBreadcrumbStructuredDataList = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) =>
  structuredDataList.flatMap((structuredData) => {
    if (!("@type" in structuredData)) {
      return [];
    }

    const type = structuredData["@type"];

    return type === "BreadcrumbList" ? [structuredData] : [];
  });

export const getEventStructuredData = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const eventStructuredDataList = structuredDataList.flatMap(
    (structuredData) => {
      if (!("@type" in structuredData)) {
        return [];
      }

      const type = structuredData["@type"];

      return type === "Event" ||
        type === "BusinessEvent" ||
        type === "ChildrensEvent" ||
        type === "ComedyEvent" ||
        type === "CourseInstance" ||
        type === "DanceEvent" ||
        type === "DeliveryEvent" ||
        type === "EducationEvent" ||
        type === "EventSeries" ||
        type === "ExhibitionEvent" ||
        type === "Festival" ||
        type === "FoodEvent" ||
        type === "Hackathon" ||
        type === "LiteraryEvent" ||
        type === "MusicEvent" ||
        type === "PublicationEvent" ||
        type === "BroadcastEvent" ||
        type === "OnDemandEvent" ||
        type === "SaleEvent" ||
        type === "ScreeningEvent" ||
        type === "SocialEvent" ||
        type === "SportsEvent" ||
        type === "TheaterEvent" ||
        type === "UserInteraction" ||
        type === "UserBlocks" ||
        type === "UserCheckins" ||
        type === "UserComments" ||
        type === "UserDownloads" ||
        type === "UserLikes" ||
        type === "UserPageVisits" ||
        type === "UserPlays" ||
        type === "UserPlusOnes" ||
        type === "UserTweets" ||
        type === "VisualArtsEvent"
        ? [structuredData]
        : [];
    }
  );

  if (eventStructuredDataList.length < 1) {
    return;
  }

  return eventStructuredDataList[0];
};

export const getLogoStructuredData = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const logoStructuredDataList = structuredDataList.flatMap(
    (structuredData) => {
      if (!("@type" in structuredData)) {
        return [];
      }

      const type = structuredData["@type"];

      return type === "Organization" ||
        type === "Airline" ||
        type === "Consortium" ||
        type === "Corporation" ||
        type === "EducationalOrganization" ||
        type === "CollegeOrUniversity" ||
        type === "ElementarySchool" ||
        type === "HighSchool" ||
        type === "MiddleSchool" ||
        type === "Preschool" ||
        type === "School" ||
        type === "FundingScheme" ||
        type === "GovernmentOrganization" ||
        type === "LibrarySystem" ||
        type === "LocalBusiness" ||
        type === "AnimalShelter" ||
        type === "ArchiveOrganization" ||
        type === "AutomotiveBusiness" ||
        type === "AutoBodyShop" ||
        type === "AutoDealer" ||
        type === "AutoPartsStore" ||
        type === "AutoRental" ||
        type === "AutoRepair" ||
        type === "AutoWash" ||
        type === "GasStation" ||
        type === "MotorcycleDealer" ||
        type === "MotorcycleRepair" ||
        type === "ChildCare" ||
        type === "Dentist" ||
        type === "DryCleaningOrLaundry" ||
        type === "EmergencyService" ||
        type === "FireStation" ||
        type === "Hospital" ||
        type === "PoliceStation" ||
        type === "EmploymentAgency" ||
        type === "EntertainmentBusiness" ||
        type === "AdultEntertainment" ||
        type === "AmusementPark" ||
        type === "ArtGallery" ||
        type === "Casino" ||
        type === "ComedyClub" ||
        type === "MovieTheater" ||
        type === "NightClub" ||
        type === "FinancialService" ||
        type === "AccountingService" ||
        type === "AutomatedTeller" ||
        type === "BankOrCreditUnion" ||
        type === "InsuranceAgency" ||
        type === "FoodEstablishment" ||
        type === "Bakery" ||
        type === "BarOrPub" ||
        type === "Brewery" ||
        type === "CafeOrCoffeeShop" ||
        type === "Distillery" ||
        type === "FastFoodRestaurant" ||
        type === "IceCreamShop" ||
        type === "Restaurant" ||
        type === "Winery" ||
        type === "GovernmentOffice" ||
        type === "PostOffice" ||
        type === "HealthAndBeautyBusiness" ||
        type === "BeautySalon" ||
        type === "DaySpa" ||
        type === "HairSalon" ||
        type === "HealthClub" ||
        type === "NailSalon" ||
        type === "TattooParlor" ||
        type === "HomeAndConstructionBusiness" ||
        type === "Electrician" ||
        type === "GeneralContractor" ||
        type === "HVACBusiness" ||
        type === "HousePainter" ||
        type === "Locksmith" ||
        type === "MovingCompany" ||
        type === "Plumber" ||
        type === "RoofingContractor" ||
        type === "InternetCafe" ||
        type === "LegalService" ||
        type === "Attorney" ||
        type === "Notary" ||
        type === "Library" ||
        type === "LodgingBusiness" ||
        type === "BedAndBreakfast" ||
        type === "Campground" ||
        type === "Hostel" ||
        type === "Hotel" ||
        type === "Motel" ||
        type === "Resort" ||
        type === "SkiResort" ||
        type === "MedicalBusiness" ||
        // @ts-expect-error
        type === "CommunityHealth" ||
        // @ts-expect-error
        type === "Dentist" ||
        // @ts-expect-error
        type === "Dermatology" ||
        // @ts-expect-error
        type === "DietNutrition" ||
        // @ts-expect-error
        type === "Emergency" ||
        // @ts-expect-error
        type === "Geriatric" ||
        // @ts-expect-error
        type === "Gynecologic" ||
        type === "MedicalClinic" ||
        type === "CovidTestingFacility" ||
        // @ts-expect-error
        type === "Midwifery" ||
        // @ts-expect-error
        type === "Nursing" ||
        // @ts-expect-error
        type === "Obstetric" ||
        // @ts-expect-error
        type === "Oncologic" ||
        type === "Optician" ||
        // @ts-expect-error
        type === "Optometric" ||
        // @ts-expect-error
        type === "Otolaryngologic" ||
        // @ts-expect-error
        type === "Pediatric" ||
        type === "Pharmacy" ||
        type === "Physician" ||
        // @ts-expect-error
        type === "Physiotherapy" ||
        // @ts-expect-error
        type === "PlasticSurgery" ||
        // @ts-expect-error
        type === "Podiatric" ||
        // @ts-expect-error
        type === "PrimaryCare" ||
        // @ts-expect-error
        type === "Psychiatric" ||
        // @ts-expect-error
        type === "PublicHealth" ||
        type === "ProfessionalService" ||
        type === "RadioStation" ||
        type === "RealEstateAgent" ||
        type === "RecyclingCenter" ||
        type === "SelfStorage" ||
        type === "ShoppingCenter" ||
        type === "SportsActivityLocation" ||
        type === "BowlingAlley" ||
        type === "ExerciseGym" ||
        type === "GolfCourse" ||
        // @ts-expect-error
        type === "HealthClub" ||
        type === "PublicSwimmingPool" ||
        // @ts-expect-error
        type === "SkiResort" ||
        type === "SportsClub" ||
        type === "StadiumOrArena" ||
        type === "TennisComplex" ||
        type === "Store" ||
        // @ts-expect-error
        type === "AutoPartsStore" ||
        type === "BikeStore" ||
        type === "BookStore" ||
        type === "ClothingStore" ||
        type === "ComputerStore" ||
        type === "ConvenienceStore" ||
        type === "DepartmentStore" ||
        type === "ElectronicsStore" ||
        type === "Florist" ||
        type === "FurnitureStore" ||
        type === "GardenStore" ||
        type === "GroceryStore" ||
        type === "HardwareStore" ||
        type === "HobbyShop" ||
        type === "HomeGoodsStore" ||
        type === "JewelryStore" ||
        type === "LiquorStore" ||
        type === "MensClothingStore" ||
        type === "MobilePhoneStore" ||
        type === "MovieRentalStore" ||
        type === "MusicStore" ||
        type === "OfficeEquipmentStore" ||
        type === "OutletStore" ||
        type === "PawnShop" ||
        type === "PetStore" ||
        type === "ShoeStore" ||
        type === "SportingGoodsStore" ||
        type === "TireShop" ||
        type === "ToyStore" ||
        type === "WholesaleStore" ||
        type === "TelevisionStation" ||
        type === "TouristInformationCenter" ||
        type === "TravelAgency" ||
        type === "MedicalOrganization" ||
        // @ts-expect-error
        type === "Dentist" ||
        type === "DiagnosticLab" ||
        // @ts-expect-error
        type === "Hospital" ||
        // @ts-expect-error
        type === "MedicalClinic" ||
        // @ts-expect-error
        type === "Pharmacy" ||
        // @ts-expect-error
        type === "Physician" ||
        type === "VeterinaryCare" ||
        type === "NGO" ||
        type === "NewsMediaOrganization" ||
        type === "PerformingGroup" ||
        type === "DanceGroup" ||
        type === "MusicGroup" ||
        type === "TheaterGroup" ||
        type === "Project" ||
        type === "FundingAgency" ||
        type === "ResearchProject" ||
        type === "ResearchOrganization" ||
        type === "SportsOrganization" ||
        type === "SportsTeam" ||
        type === "WorkersUnion"
        ? [structuredData]
        : [];
    }
  );

  if (logoStructuredDataList.length < 1) {
    return;
  }

  return logoStructuredDataList[0];
};

export const getProductStructuredData = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const productStructuredDataList = structuredDataList.flatMap(
    (structuredData) => {
      if (!("@type" in structuredData)) {
        return [];
      }

      const type = structuredData["@type"];

      return type === "Product" ||
        type === "IndividualProduct" ||
        type === "ProductCollection" ||
        type === "ProductGroup" ||
        type === "ProductModel" ||
        type === "SomeProducts" ||
        type === "Vehicle" ||
        type === "BusOrCoach" ||
        type === "Car" ||
        type === "Motorcycle" ||
        type === "MotorizedBicycle"
        ? [structuredData]
        : [];
    }
  );

  if (productStructuredDataList.length < 1) {
    return;
  }

  return productStructuredDataList[0];
};

export const getLocalBusinessStructuredData = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const localBusinessStructuredDataList = structuredDataList.flatMap(
    (structuredData) => {
      if (!("@type" in structuredData)) {
        return [];
      }

      const type = structuredData["@type"];

      return type === "LocalBusiness" ||
        type === "AnimalShelter" ||
        type === "ArchiveOrganization" ||
        type === "AutomotiveBusiness" ||
        type === "AutoBodyShop" ||
        type === "AutoDealer" ||
        type === "AutoPartsStore" ||
        type === "AutoRental" ||
        type === "AutoRepair" ||
        type === "AutoWash" ||
        type === "GasStation" ||
        type === "MotorcycleDealer" ||
        type === "MotorcycleRepair" ||
        type === "ChildCare" ||
        type === "Dentist" ||
        type === "DryCleaningOrLaundry" ||
        type === "EmergencyService" ||
        type === "FireStation" ||
        type === "Hospital" ||
        type === "PoliceStation" ||
        type === "EmploymentAgency" ||
        type === "EntertainmentBusiness" ||
        type === "AdultEntertainment" ||
        type === "AmusementPark" ||
        type === "ArtGallery" ||
        type === "Casino" ||
        type === "ComedyClub" ||
        type === "MovieTheater" ||
        type === "NightClub" ||
        type === "FinancialService" ||
        type === "AccountingService" ||
        type === "AutomatedTeller" ||
        type === "BankOrCreditUnion" ||
        type === "InsuranceAgency" ||
        type === "FoodEstablishment" ||
        type === "Bakery" ||
        type === "BarOrPub" ||
        type === "Brewery" ||
        type === "CafeOrCoffeeShop" ||
        type === "Distillery" ||
        type === "FastFoodRestaurant" ||
        type === "IceCreamShop" ||
        type === "Restaurant" ||
        type === "Winery" ||
        type === "GovernmentOffice" ||
        type === "PostOffice" ||
        type === "HealthAndBeautyBusiness" ||
        type === "BeautySalon" ||
        type === "DaySpa" ||
        type === "HairSalon" ||
        type === "HealthClub" ||
        type === "NailSalon" ||
        type === "TattooParlor" ||
        type === "HomeAndConstructionBusiness" ||
        type === "Electrician" ||
        type === "GeneralContractor" ||
        type === "HVACBusiness" ||
        type === "HousePainter" ||
        type === "Locksmith" ||
        type === "MovingCompany" ||
        type === "Plumber" ||
        type === "RoofingContractor" ||
        type === "InternetCafe" ||
        type === "LegalService" ||
        type === "Attorney" ||
        type === "Notary" ||
        type === "Library" ||
        type === "LodgingBusiness" ||
        type === "BedAndBreakfast" ||
        type === "Campground" ||
        type === "Hostel" ||
        type === "Hotel" ||
        type === "Motel" ||
        type === "Resort" ||
        type === "SkiResort" ||
        type === "MedicalBusiness" ||
        // @ts-expect-error
        type === "CommunityHealth" ||
        // @ts-expect-error
        type === "Dentist" ||
        // @ts-expect-error
        type === "Dermatology" ||
        // @ts-expect-error
        type === "DietNutrition" ||
        // @ts-expect-error
        type === "Emergency" ||
        // @ts-expect-error
        type === "Geriatric" ||
        // @ts-expect-error
        type === "Gynecologic" ||
        type === "MedicalClinic" ||
        type === "CovidTestingFacility" ||
        // @ts-expect-error
        type === "Midwifery" ||
        // @ts-expect-error
        type === "Nursing" ||
        // @ts-expect-error
        type === "Obstetric" ||
        // @ts-expect-error
        type === "Oncologic" ||
        type === "Optician" ||
        // @ts-expect-error
        type === "Optometric" ||
        // @ts-expect-error
        type === "Otolaryngologic" ||
        // @ts-expect-error
        type === "Pediatric" ||
        type === "Pharmacy" ||
        type === "Physician" ||
        // @ts-expect-error
        type === "Physiotherapy" ||
        // @ts-expect-error
        type === "PlasticSurgery" ||
        // @ts-expect-error
        type === "Podiatric" ||
        // @ts-expect-error
        type === "PrimaryCare" ||
        // @ts-expect-error
        type === "Psychiatric" ||
        // @ts-expect-error
        type === "PublicHealth" ||
        type === "ProfessionalService" ||
        type === "RadioStation" ||
        type === "RealEstateAgent" ||
        type === "RecyclingCenter" ||
        type === "SelfStorage" ||
        type === "ShoppingCenter" ||
        type === "SportsActivityLocation" ||
        type === "BowlingAlley" ||
        type === "ExerciseGym" ||
        type === "GolfCourse" ||
        // @ts-expect-error
        type === "HealthClub" ||
        type === "PublicSwimmingPool" ||
        // @ts-expect-error
        type === "SkiResort" ||
        type === "SportsClub" ||
        type === "StadiumOrArena" ||
        type === "TennisComplex" ||
        type === "Store" ||
        // @ts-expect-error
        type === "AutoPartsStore" ||
        type === "BikeStore" ||
        type === "BookStore" ||
        type === "ClothingStore" ||
        type === "ComputerStore" ||
        type === "ConvenienceStore" ||
        type === "DepartmentStore" ||
        type === "ElectronicsStore" ||
        type === "Florist" ||
        type === "FurnitureStore" ||
        type === "GardenStore" ||
        type === "GroceryStore" ||
        type === "HardwareStore" ||
        type === "HobbyShop" ||
        type === "HomeGoodsStore" ||
        type === "JewelryStore" ||
        type === "LiquorStore" ||
        type === "MensClothingStore" ||
        type === "MobilePhoneStore" ||
        type === "MovieRentalStore" ||
        type === "MusicStore" ||
        type === "OfficeEquipmentStore" ||
        type === "OutletStore" ||
        type === "PawnShop" ||
        type === "PetStore" ||
        type === "ShoeStore" ||
        type === "SportingGoodsStore" ||
        type === "TireShop" ||
        type === "ToyStore" ||
        type === "WholesaleStore" ||
        type === "TelevisionStation" ||
        type === "TouristInformationCenter" ||
        type === "TravelAgency"
        ? [structuredData]
        : [];
    }
  );

  if (localBusinessStructuredDataList.length < 1) {
    return;
  }

  return localBusinessStructuredDataList[0];
};

export const isStructuredData = (
  unknown: unknown
): unknown is WithContext<Thing> => {
  const structuredDataContexts: unknown[] = [
    "http://schema.org",
    "http://schema.org/",
    "https://schema.org",
    "https://schema.org/",
  ];

  return (
    isObject(unknown) && structuredDataContexts.includes(unknown["@context"])
  );
};

export const removeSchemaURL = (string: string) =>
  string.replace("http://schema.org/", "").replace("https://schema.org/", "");

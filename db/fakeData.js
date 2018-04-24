const { sequelize } = require('./schema');
const logger = require('../logger');
const { Surcharge, Stay, Hotel, Customer, Employee } = require('./models');

const fakeData = {
  customers: [
    {
      firstName: 'Cool',
      lastName: 'Guy',
      email: 'a@a.com',
      password: 'asdfasdf',
      phoneNumber: '96968828',
      rating: 1,
    },
    {
      firstName: 'Sean',
      lastName: 'Ng',
      password: 'asdfasdf',
      email: 'shonum@gmail.com',
      phoneNumber: '96968828',
      rating: 1,
    },
    {
      firstName: 'Reggie',
      lastName: 'Miller',
      password: 'abc',
      email: 'shonum2@gmail.com',
      phoneNumber: '91910404',
    },
    {
      firstName: 'Michael',
      lastName: 'Wong',
      password: 'abc',
      email: 'michaelwong@gmail.com',
      phoneNumber: '91280102',
    },
    {
      firstName: 'Gigi',
      lastName: 'Wings',
      password: 'abc',
      email: 'chickenwings@gmail.com',
      phoneNumber: '99830203',
    },
    {
      firstName: 'Fucking',
      lastName: 'Legend',
      password: 'abc',
      email: 'afuckinglegend@gmail.com',
      phoneNumber: '12345678',
    },
  ],
  hotels: [
    {
      name: 'The Grand Hyatt Hong Kong',
      locationAddress:
        'Hong Kong Convention And Exhibition Centre, 1 Harbour Rd, Wan Chai, Hong Kong',
      locationLatitude: '22.278060',
      locationLongitude: '114.117346',
      costCurrency: 'HKD',
      costMinCharge: 120,
      costPerMinute: 4,
      costPerHour: 239,
      photos: [
        'https://www.scmp.com/sites/default/files/styles/660x385/public/2016/10/12/grand-hyatt-hong-kong-presidential-suite-bedroom-3608_2mb.jpg',
        'https://www.scmp.com/sites/default/files/styles/660x385/public/2016/10/12/grandhyatt-hk-p2-24.jpg',
        'https://www.scmp.com/sites/default/files/styles/660x385/public/2016/10/12/grand-hyatt-hong-kong-presidential-suite-bedroom-3608_2mb.jpg',
      ],
      description:
        '<p>&hearts; nice job!</p><p>A 5-minute walk from Wan Chai Ferry Pier, this upscale, high-rise hotel with a glass facade is also an 8-minute walk from the Hong Kong Convention and Exhibition Centre and 4 km from Victoria Harbour.</p><p>Relaxed rooms with marble bathrooms feature flat-screen TVs, minibars and tea and coffeemaking facilities. Upgraded rooms add sitting areas and balconies with city/harbor views. Suites offer living/dining areas. Room service is available.</p><p><b>Amenities include 3 stylish eateries, a bar and a lounge with live music, plus a business center, a gym and an outdoor seasonal pool. Paid parking is available.</b></p>',
      roomType: 'Deluxe Room',
      stripeId: 'acct_1CFjUWHzSDnfoId9',
      amenities: ['miniBar'],
    },
    {
      name: 'Regal Hotel Wanchai',
      locationAddress: '88 Yee Wo St, Causeway Bay',
      locationLatitude: '22.279148',
      locationLongitude: '114.186829',
      costCurrency: 'HKD',
      costMinCharge: 500,
      costPerMinute: 4,
      costPerHour: 400,
      photos: [
        'https://static.pexels.com/photos/97083/pexels-photo-97083.jpeg',
        'https://static.pexels.com/photos/271639/pexels-photo-271639.jpeg',
        'https://static.pexels.com/photos/271672/pexels-photo-271672.jpeg',
        'https://static.pexels.com/photos/189293/pexels-photo-189293.jpeg',
      ],
      description: `Lorem ipsum dolor sit amet, pro ut accusamus elaboraret. Ei quidam definitiones eum, ex eruditi tibique definiebas sed. Sed epicurei delicata consequat at. No habeo evertitur duo.

      Epicuri platonem moderatius his id. Pri audiam nominati signiferumque an, mel id mundi aliquam offendit. Ad audiam similique interesset cum, mei malis ubique epicurei ei, ei tota dignissim interpretaris vis. Corrumpit persecuti mel ne, ea eripuit denique argumentum sed, mel id quas noluisse. An aliquam graecis his, ei his malis utinam labores.
  
      Usu eu alii lucilius dignissim. In iisque mediocritatem pro, ad vel labore salutandi disputando, ad ius assentior instructior. Vis elitr munere ex, at malorum gubergren sit, summo definitionem ei qui. Te sit virtute nominavi persequeris, vel cu idque essent denique, eum no case nobis. Modus scripserit cu his, cum quas dolore ei.
  
      Nec cu wisi errem. Eu ius reque nobis, nam commune epicurei no, ut sea apeirian comprehensam mediocritatem. Sale aperiri maiestatis pri eu, ea eam dolorem maiorum efficiendi, his te mentitum detraxit. Ferri laoreet deterruisset te sea. His nostro ceteros cu, et liber semper duo.`,
      roomType: 'Deluxe Room',
      stripeId: 'acct_1CFjUWHzSDnfoId9',
      amenities: ['miniBar'],
    },
    {
      name: 'The Peninsula Hong Kong',
      locationAddress: 'Salisbury Rd, Tsim Sha Tsui, Hong Kong',
      locationLatitude: '22.295102',
      locationLongitude: '114.173',
      costCurrency: 'HK$',
      costMinCharge: 300,
      costPerMinute: 3,
      stripeId: 'acct_1CFjUWHzSDnfoId9',
      costPerHour: 150,
      photos: [
        'https://www.scmp.com/sites/default/files/styles/660x385/public/2016/10/12/grand-hyatt-hong-kong-presidential-suite-bedroom-3608_2mb.jpg',
        'https://www.scmp.com/sites/default/files/styles/660x385/public/2016/10/12/grandhyatt-hk-p2-24.jpg',
        'https://www.scmp.com/sites/default/files/styles/660x385/public/2016/10/12/grand-hyatt-hong-kong-presidential-suite-bedroom-3608_2mb.jpg',
      ],
      description:
        '<p>&hearts; nice job!</p><p>A 5-minute walk from Wan Chai Ferry Pier, this upscale, high-rise hotel with a glass facade is also an 8-minute walk from the Hong Kong Convention and Exhibition Centre and 4 km from Victoria Harbour.</p><p>Relaxed rooms with marble bathrooms feature flat-screen TVs, minibars and tea and coffeemaking facilities. Upgraded rooms add sitting areas and balconies with city/harbor views. Suites offer living/dining areas. Room service is available.</p><p><b>Amenities include 3 stylish eateries, a bar and a lounge with live music, plus a business center, a gym and an outdoor seasonal pool. Paid parking is available.</b></p>',
      roomType: 'Deluxe Room',
      amenities: ['wifi', 'gym', 'laundry', 'minibar', 'hairdryer'],
    },
    {
      name: 'Sheraton Hotel Kowloon',
      locationAddress: '88 Yee Wo St, Causeway Bay',
      locationLatitude: '22.279148',
      locationLongitude: '114.186829',
      costCurrency: 'HKD',
      costMinCharge: 500,
      costPerMinute: 4,
      costPerHour: 400,
      photos: [
        'https://static.pexels.com/photos/97083/pexels-photo-97083.jpeg',
        'https://static.pexels.com/photos/271639/pexels-photo-271639.jpeg',
        'https://static.pexels.com/photos/271672/pexels-photo-271672.jpeg',
        'https://static.pexels.com/photos/189293/pexels-photo-189293.jpeg',
      ],
      description: `Lorem ipsum dolor sit amet, pro ut accusamus elaboraret. Ei quidam definitiones eum, ex eruditi tibique definiebas sed. Sed epicurei delicata consequat at. No habeo evertitur duo.

      Epicuri platonem moderatius his id. Pri audiam nominati signiferumque an, mel id mundi aliquam offendit. Ad audiam similique interesset cum, mei malis ubique epicurei ei, ei tota dignissim interpretaris vis. Corrumpit persecuti mel ne, ea eripuit denique argumentum sed, mel id quas noluisse. An aliquam graecis his, ei his malis utinam labores.
  
      Usu eu alii lucilius dignissim. In iisque mediocritatem pro, ad vel labore salutandi disputando, ad ius assentior instructior. Vis elitr munere ex, at malorum gubergren sit, summo definitionem ei qui. Te sit virtute nominavi persequeris, vel cu idque essent denique, eum no case nobis. Modus scripserit cu his, cum quas dolore ei.
  
      Nec cu wisi errem. Eu ius reque nobis, nam commune epicurei no, ut sea apeirian comprehensam mediocritatem. Sale aperiri maiestatis pri eu, ea eam dolorem maiorum efficiendi, his te mentitum detraxit. Ferri laoreet deterruisset te sea. His nostro ceteros cu, et liber semper duo.`,
      roomType: 'Deluxe Room',
      stripeId: 'acct_1CFjUWHzSDnfoId9',
      amenities: [],
    },
  ],
  employees: [
    {
      hotelId: 1,
      firstName: 'BigFat',
      lastName: 'Loser',
      email: 'tester@testhotel.com',
      phoneNumber: '(852) 9193-4810',
      password: 'asdfasdf',
      verified: true,
      photoUrl:
        'https://upload.wikimedia.org/wikipedia/en/5/5e/Avatar%28Neytiri%29.jpg',
      adminLevel: 2,
    },
    {
      hotelId: 1,
      firstName: 'Andrew',
      lastName: 'Stevenson',
      email: 'tester2@testhotel.com',
      phoneNumber: '(852) 9193-4810',
      password: 'asdfasdf',
      verified: true,
      inviterId: 1,
      photoUrl:
        'https://upload.wikimedia.org/wikipedia/en/5/5e/Avatar%28Neytiri%29.jpg',
      adminLevel: 1,
    },
    {
      hotelId: 1,
      firstName: 'Thierry',
      lastName: 'Henry',
      email: 'tester3@testhotel.com',
      phoneNumber: '(852) 9193-4810',
      password: 'asdfasdf',
      verified: true,
      inviterId: 1,
      photoUrl:
        'https://upload.wikimedia.org/wikipedia/en/5/5e/Avatar%28Neytiri%29.jpg',
      adminLevel: 1,
    },
    {
      hotelId: 1,
      firstName: 'Danny',
      lastName: 'Welbeck',
      email: 'tester4@testhotel.com',
      phoneNumber: '(852) 9193-4810',
      password: 'asdfasdf',
      inviterId: 1,
      photoUrl:
        'https://upload.wikimedia.org/wikipedia/en/5/5e/Avatar%28Neytiri%29.jpg',
      adminLevel: 1,
    },
    {
      hotelId: 1,
      firstName: 'Sherlock',
      lastName: 'Holmes',
      email: 'tester5@testhotel.com',
      phoneNumber: '(852) 9193-4810',
      password: 'asdfasdf',
      inviterId: 1,
      verified: true,
      photoUrl:
        'https://upload.wikimedia.org/wikipedia/en/5/5e/Avatar%28Neytiri%29.jpg',
      adminLevel: 1,
    },
    {
      hotelId: 1,
      firstName: 'Dikembe',
      lastName: 'Wjinaldum',
      email: 'tester6@testhotel.com',
      phoneNumber: '(852) 9193-4810',
      password: 'asdfasdf',
      verified: false,
      inviterId: 1,
      photoUrl:
        'https://upload.wikimedia.org/wikipedia/en/5/5e/Avatar%28Neytiri%29.jpg',
      adminLevel: 2,
    },
    {
      hotelId: 1,
      firstName: 'Shaquille',
      lastName: "O'Neal",
      email: 'tester7@testhotel.com',
      phoneNumber: '(852) 9193-4810',
      password: 'asdfasdf',
      verified: true,
      inviterId: 2,
      photoUrl:
        'https://upload.wikimedia.org/wikipedia/en/5/5e/Avatar%28Neytiri%29.jpg',
      adminLevel: 2,
    },
    {
      hotelId: 2,
      firstName: 'Meow',
      lastName: 'Wolfcat',
      email: 'test@sheraton.com',
      verified: true,
      phoneNumber: '(852) 9193-4810',
      photoUrl:
        'https://upload.wikimedia.org/wikipedia/en/5/5e/Avatar%28Neytiri%29.jpg',
      password: 'asdfasdf',
    },
  ],
  stays: [
    {
      hotelId: 1,
      customerId: 1,
      status: 'CHECKED_OUT',
      roomNumber: 410,
      roomType: 'Deluxe Room',
      bookingTime: 1491015600000,
      checkInTime: 1491019200000,
      checkOutTime: 1491026400000,
      roomCharge: 800.0,
      totalCharge: 850.05,
    },
    {
      hotelId: 1,
      customerId: 1,
      status: 'CHECKED_OUT',
      roomNumber: 431,
      roomType: 'Deluxe Room',
      bookingTime: 1491015600000,
      checkInTime: 1491019200000,
      checkOutTime: 1491026400000,
      roomCharge: 800.0,
      totalCharge: 850.05,
    },
    {
      hotelId: 2,
      customerId: 1,
      status: 'CHECKED_OUT',
      roomNumber: 404,
      roomType: 'Deluxe Room',
      bookingTime: 1491015600000,
      checkInTime: 1491019200000,
      checkOutTime: 1491026400000,
      roomCharge: 1220.0,
      totalCharge: 2810.05,
    },
    {
      hotelId: 3,
      customerId: 1,
      status: 'CHECKED_OUT',
      roomNumber: 501,
      roomType: 'Standard Room',
      bookingTime: 1491015600000,
      checkInTime: 1491019200000,
      checkOutTime: 1491026400000,
      roomCharge: 800.0,
      totalCharge: 3000.05,
    },
    {
      hotelId: 1,
      customerId: 2,
      status: 'CHECKED_OUT',
      roomType: 'Deluxe Room',
      roomNumber: 1029,
      bookingTime: 1491026400000,
      checkInTime: 1491031800000,
      checkOutTime: 1491042600000,
      roomCharge: 1200.0,
      totalCharge: 1338.0,
    },
    {
      hotelId: 1,
      customerId: 3,
      status: 'CHECKED_OUT',
      roomType: 'Deluxe Room',
      roomNumber: 1023,
      bookingTime: 1491129000000,
      checkInTime: 1491131700000,
      checkOutTime: 1491138900000,
      roomCharge: 800.0,
      totalCharge: 900.18,
    },
    {
      hotelId: 1,
      status: 'AVAILABLE',
      roomType: 'Deluxe Room',
      roomNumber: 1023,
    },
    {
      hotelId: 1,
      status: 'AVAILABLE',
      roomType: 'Deluxe Room',
      roomNumber: 1232131,
    },
    {
      hotelId: 1,
      status: 'AVAILABLE',
      roomType: 'Deluxe Room',
      roomNumber: 1025,
    },
    {
      hotelId: 1,
      status: 'AVAILABLE',
      roomType: 'Deluxe Room',
      roomNumber: 1024,
    },
    {
      hotelId: 1,
      status: 'AVAILABLE',
      roomType: 'Deluxe Room',
      roomNumber: 1111,
    },
    {
      hotelId: 1,
      roomType: 'Deluxe Room',
      status: 'AVAILABLE',
      roomNumber: 12321,
    },
    {
      hotelId: 1,
      roomType: 'Deluxe Room',
      status: 'AVAILABLE',
      roomNumber: 123213,
    },

    {
      hotelId: 1,
      customerId: 1,
      status: 'BOOKED',
      roomType: 'Deluxe Room',
      roomNumber: 1013,
      bookingTime: 1489381804189,
    },
    {
      hotelId: 1,
      customerId: 2,
      status: 'BOOKED',
      roomType: 'Deluxe Room',
      roomNumber: 'ABA',
      bookingTime: 1489381804189,
      checkInTime: 1489381904189,
    },
    {
      hotelId: 1,
      customerId: 1,
      status: 'BOOKED',
      roomType: 'Deluxe Room',
      roomNumber: 'A482',
      bookingTime: 1489381804189,
      checkInTime: 1489381904189,
    },
    {
      hotelId: 1,
      customerId: 4,
      status: 'BOOKED',
      roomType: 'Deluxe Room',
      roomNumber: '12832',
      bookingTime: 1489381804189,
      checkInTime: 1489381904189,
    },
    {
      hotelId: 1,
      customerId: 3,
      status: 'BOOKED',
      roomType: 'Deluxe Room',
      roomNumber: '382',
      bookingTime: 1489381804189,
      checkInTime: 1489381904189,
    },
    {
      hotelId: 1,
      customerId: 3,
      status: 'CHECKED_OUT',
      roomType: 'Deluxe Room',
      roomNumber: '1923',
      bookingTime: 1489381804189,
      checkInTime: 1489381904189,
      checkOutTime: 1489381904189,
      roomCharge: 800.0,
      totalCharge: 900.18,
    },
  ],
  surcharges: [
    {
      stayId: 1,
      service: 'Massage',
      status: 'Unsettled',
      charge: 30.05,
    },
    {
      stayId: 1,
      service: 'Room Service',
      status: 'Unsettled',
      charge: 20.0,
    },
    {
      stayId: 2,
      service: 'Room Service',
      status: 'Unsettled',
      charge: 25.5,
    },
    {
      stayId: 2,
      service: 'Room Service',
      status: 'Unsettled',
      charge: 102.5,
    },
    {
      stayId: 2,
      service: 'Pay TV',
      status: 'Unsettled',
      charge: 10.0,
    },
    {
      stayId: 3,
      service: 'Pay TV',
      status: 'Unsettled',
      charge: 100.18,
    },
  ],
};

module.exports = async () => {
  try {
    await sequelize.sync({ force: true });
    await Customer.bulkCreate(fakeData.customers);
    await Hotel.bulkCreate(fakeData.hotels);
    await Stay.bulkCreate(fakeData.stays);
    await Surcharge.bulkCreate(fakeData.surcharges);
    await Employee.bulkCreate(fakeData.employees);
  } catch (error) {
    logger.error(error);
  }
};

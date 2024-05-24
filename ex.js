const dataReview = [
  {
    name: "đánh giá tháng 5",
    desc: "đây là đánh giá tháng 5",
    standards: [
      {
        name: "tiêu chuẩn 1",
        criterias: [
          {
            name: "tiêu chí 1",
            score: 10,
          },
          {
            name: "tiêu chí 2",
            score: 8,
          },
        ],
      },
      {
        name: "tiêu chuẩn 2",
        criterias: [
          {
            name: "tiêu chí 1",
            score: 10,
          },
          {
            name: "tiêu chí 2",
            score: 8,
          },
          {
            name: "tiêu chí 3",
            score: 6,
          },
        ],
      },
    ],
    status: "done",
    reviews: [
      {
        idUser: "1",
        details: [
          [true, true],
          [true, false, true],
        ],
      },
      {
        idUser: "2",
        details: [
          [true, true],
          [true, false, true],
        ],
      },
    ],
  },
  {
    name: "đánh giá tháng 6",
    desc: "đây là đánh giá tháng 6",
    standards: [
      {
        name: "tiêu chuẩn 1",
        criterias: [
          {
            name: "tiêu chí 1",
            score: 10,
          },
          {
            name: "tiêu chí 2",
            score: 8,
          },
        ],
      },
      {
        name: "tiêu chuẩn 2",
        criterias: [
          {
            name: "tiêu chí 1",
            score: 10,
          },
          {
            name: "tiêu chí 2",
            score: 8,
          },
          {
            name: "tiêu chí 3",
            score: 6,
          },
        ],
      },
    ],
    status: "done",
    reviews: [
      {
        idUser: "1",
        details: [
          [true, true],
          [true, false, true],
        ],
      },
      {
        idUser: "2",
        details: [
          [true, true],
          [true, false, true],
        ],
      },
    ],
  },
];

let dataUser1 = dataReview.map((review) => {
  let outputData = {
    name: review.name,
    desc: review.desc,
    status: review.status,
    standards: review.standards,
  };
  outputData.reviews = review.reviews.find((item) => item.idUser === "1");
  return outputData;
});
let dataDetails = dataUser1.map((review) => {
  let output = review.reviews.details.map((item, indStandard) => {
    let outputItem = item.map((detail, indCriteria) => {
      let a = {
        criteria: review.standards[indStandard].criterias[indCriteria].name,
        score: review.standards[indStandard].criterias[indCriteria].score,
        result: detail,
      };
      return a;
    });

    return {
      standard: review.standards[indStandard].name,
      details: outputItem,
    };
  });
  return output;
});
console.log(JSON.stringify(dataDetails));

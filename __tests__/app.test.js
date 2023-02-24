const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpointsJson = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET /api/topics", () => {
  it("200: should return an array of topic objects each object should contain slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  it("404: should return path not found if passed valid but non existent path", () => {
    return request(app)
      .get("/api/topcs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/articles", () => {
  it("200: should return an array of article objects with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  it("200: should return articles array sorted by date(created_at) in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("404: should return path not found if passed valid but non existent path", () => {
    return request(app)
      .get("/api/artcles")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  describe("GET  /api/articles?sort_by=queries", () => {
    it("200: responds with array of object articles with the specified topic in the query", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(1);
          expect(articles[0].topic).toBe("cats");
        });
    });
    it("200: responds with an array of object articles sorted by the specified column", () => {
      return request(app)
        .get("/api/articles?sort_by=title&&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          console.log(articles);
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy("title", {
            descending: false,
          });
        });
    });
    it("200: responds with an array of object articles with an order query of asc", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", {
            descending: false,
          });
        });
    });
    it("200: responds with an array of object articles with an order query of desc", () => {
      return request(app)
        .get("/api/articles?order=desc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("200: responds with an array of object articles with a default value order descending and sort_by date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("200: should respond with an empty array if passed a topic that exists but not in any article", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(0);
        });
    });
    it("400: responds with a msg if passed a non exitent column name", () => {
      return request(app)
        .get("/api/articles?sort_by=price")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Column not found");
        });
    });
    it("404: responds with not found if passed a topic that does not exist", () => {
      return request(app)
        .get("/api/articles?topic=food")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
    it("400: should respond with a msg if passed invalid order_by query", () => {
      return request(app)
        .get("/api/articles?order=best")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order query");
        });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("200: should return an article object with the correct keys and values including a comment count for the article_id that has been passed in", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          comment_count: 2,
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          votes: 0,
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("200: should respond with the correct keys,values and comment count when passed an article_id that has no comments", () => {
    return request(app)
      .get("/api/articles/12")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          comment_count: 0,
          title: "Moustache",
          topic: "mitch",
          author: "butter_bridge",
          created_at: "2020-10-11T11:24:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          body: "Have you seen the size of that thing?",
          article_id: 12,
        });
      });
  });
  it("400: should respond with Bad Request if passed an invalid article_id", () => {
    return request(app)
      .get("/api/articles/theBestArticle")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("404: should respond with a msg article_id not found when passed when passed a valid but non existent article_id", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });
  it("404: should respond with message of Path not found if passed valid but non existent path", () => {
    return request(app)
      .get("/api/aricles/5")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: should return an array of comments for the article_id passed with the correct properties", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  it("200: response comments array should be ordered by the most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("200: should respond an empty array and 200 status code if passed an article_id that has no comments", () => {
    return request(app)
      .get("/api/articles/12/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });
  it("400: should respond with Bad Request if passed an invalid article_id", () => {
    return request(app)
      .get("/api/articles/favArticle/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("404: should respond with a msg path not found when passed when passed a valid but non existent article_id", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("201: should respond with the newly posted comment object with the correct keys and values", () => {
    const newComment = {
      username: "icellusedkars",
      body: "The first gif was great",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual({
          comment_id: 19,
          body: "The first gif was great",
          article_id: 3,
          author: "icellusedkars",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  it("201: should ignore any additional properties passed in", () => {
    const newComment = {
      username: "icellusedkars",
      body: "The first gif was great",
      comment_id: 30,
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual({
          comment_id: 19,
          body: "The first gif was great",
          article_id: 3,
          author: "icellusedkars",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  it("400: should respond with Bad Request if passed an invalid article_id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "The first gif was great",
    };

    return request(app)
      .post("/api/articles/funnyArticle/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("400: should repond with Bad Request if passed an empty object", () => {
    const newComment = {};

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("404: should respond with username not found if passed a username that does not exist", () => {
    const newComment = {
      username: "northcoder123",
      body: "The first gif was great",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("404: should respond with a msg article_id not found when passed when passed a valid but non existent article_id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "The first gif was great",
    };

    return request(app)
      .post("/api/articles/100/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("201: should respond with the updated article with the votes property increased by the number passed", () => {
    const updatedVotes = {
      inc_votes: 5,
    };

    return request(app)
      .patch("/api/articles/12")
      .send(updatedVotes)
      .expect(201)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toEqual({
          article_id: 12,
          title: "Moustache",
          topic: "mitch",
          author: "butter_bridge",
          body: "Have you seen the size of that thing?",
          created_at: "2020-10-11T11:24:00.000Z",
          votes: 5,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("201: should respond with the updated article with the votes property decreased by the number passed", () => {
    const updatedVotes = {
      inc_votes: -20,
    };

    return request(app)
      .patch("/api/articles/1")
      .send(updatedVotes)
      .expect(201)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 80,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("201: should only change the votes property any extra properties should be ignored", () => {
    const updatedVotes = {
      inc_votes: -20,
      topic: "philosophy",
      author: "Aristotle",
    };

    return request(app)
      .patch("/api/articles/1")
      .send(updatedVotes)
      .expect(201)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 80,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("400: should respond with Bad Request if passed an invalid article_id", () => {
    const updatedVotes = {
      inc_votes: 10,
    };

    return request(app)
      .patch("/api/articles/greatArticle")
      .send(updatedVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("400: should repond with Bad Request if passed an empty object", () => {
    const updatedVotes = {};

    return request(app)
      .patch("/api/articles/2")
      .send(updatedVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("400: should respond with Bad Request if passed an object with invalid value types", () => {
    const updatedVotes = {
      inc_votes: "add five votes this is great",
    };

    return request(app)
      .patch("/api/articles/12")
      .send(updatedVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("404: should respond with with a msg article_id not found when passed when passed a valid but non existent article_id", () => {
    const updatedVotes = {
      inc_votes: 10,
    };

    return request(app)
      .patch("/api/articles/100")
      .send(updatedVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });
});

describe("GET /api/users", () => {
  it("200: should respond with a array of user objects with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  it("404: should respond with a msg path not found if passed valid but non existent path", () => {
    return request(app)
      .get("/api/usrs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("204: should respond with a status code of 204 and no content if passed a valid comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  it("404: should respond with a msg if passed a valid but non existent comment_id", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment_id Not Found");
      });
  });
  it("400: should respond with Bad Request if passed an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/badComment")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api", () => {
  it("200: should repond with the endpoints.json data", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { apiEndpoints } = body;
        expect(apiEndpoints).toEqual(endpointsJson);
      });
  });
});

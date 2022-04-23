db.createUser(
    {
        user: "user",
        pwd: "123456",
        roles: [
            {
                role: "readWrite",
                db: "bookstore"
            }
        ]
    }
);
db.createCollection("book-events");
db.createCollection("loan-events");
db.createCollection("user-events");
db.createCollection("test"); //MongoDB creates the database when you first store data in that database
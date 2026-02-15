Build a lead capture and contact system.

Requirements:

* Contact form on listing detail page
* Fields:

  * Name
  * Phone
  * Email
  * Message
* Auth optional (guests allowed)
* Validation and error handling
* Mobile-first UI
* Modern design
* Loading states
* Success feedback

Database:

* Create leads table
* Store listing_id and user_id (if logged in)
* Store contact info and message
* Timestamp

Owner dashboard:

* Page to view received leads
* List leads per listing
* Basic filtering and sorting

Security:

* RLS so only listing owner sees their leads

Output:

* Contact form component
* Lead database schema
* Owner dashboard page

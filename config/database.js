const username = '' // fill your credentials or copy your URI from mongodb cloud and assign to const URI 
const password = ''
const dbName = ''
const URI = 'mongodb+srv://'+username+':'+password+'@cluster0.mmil8.mongodb.net/'+dbName+'?retryWrites=true&w=majority'

module.exports = URI

import marvelous
# Authenticate with Marvel, with keys I got from http://developer.marvel.com/
public_key = 'ba0613cb148841f5091cb0075b5076d2'
private_key = '140a52c97a8ef92f028d89a543e83d711f9e80a0'
m = marvelous.api(public_key, private_key)

# m is a session object, read about it below
m = marvelous.api(
    public_key,
    private_key,
)


# Get all comics from this week, sorted alphabetically by title
pulls = sorted(m.comics({
    'format': "comic",
    'formatType': "comic",
    'noVariants': True,
    'dateDescriptor': "thisWeek",
    'limit': 100}),
    key=lambda comic: comic.title)

api = m.call(['characters'],
             {'limit': 50})


# for comic in pulls:
# Write a line to the file with the name of the issue, and the
# id of the series
# print('{} (series #{})'.format(comic.title, comic.series.id))

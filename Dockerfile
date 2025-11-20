# Use an official Nginx image to serve the React app
FROM nginx:alpine

# Copy the build files to the Nginx HTML directory
COPY ./build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
FROM public.ecr.aws/nginx/nginx:latest
COPY ./build/ /usr/share/nginx/html
EXPOSE 80
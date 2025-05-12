--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-03-13 11:33:25

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5163 (class 0 OID 28930)
-- Dependencies: 217
-- Data for Name: brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (1, 'Nike', 'Nike, Inc. is an American athletic footwear and apparel corporation headquartered near Beaverton, Oregon.', 'https://i.ibb.co/xK1tk2BD/logonike.png', 'https://www.nike.com/vn/', '2025-03-13 09:59:16.206393+07', '2025-03-13 09:59:16.206393+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (2, 'Louis Vuitton', 'Louis Vuitton Malletier SAS, commonly known as Louis Vuitton', 'https://i.ibb.co/Wpv24qj0/Untitled-2.png', 'https://vn.louisvuitton.com/', '2025-03-13 10:58:59.526066+07', '2025-03-13 10:58:59.526066+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (3, 'SWE', 'A fashion brand ', 'https://i.ibb.co/ds7TkxhV/Untitled-3.png', 'https://swe.vn/', '2025-03-13 11:05:39.66843+07', '2025-03-13 11:05:39.66843+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5170 (class 0 OID 28951)
-- Dependencies: 224
-- Data for Name: color; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (1, 'Red', '#FF0000') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (2, 'Yellow', '#FFFF00') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (3, 'Blue', '#0000FF') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (4, 'Green', '#008000') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (5, 'Orange', '#FFA500') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (6, 'Purple', '#800080') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (7, 'Pink', '#FFC0CB') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (8, 'Brown', '#A52A2A') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (9, 'Black', '#000000') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (10, 'White', '#FFFFFF') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (11, 'Gray', '#808080') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (12, 'Cyan', '#00FFFF') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (13, 'Magenta', '#FF00FF') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (14, 'Lime', '#00FF00') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (15, 'Teal', '#008080') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (16, 'Olive', '#808000') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (17, 'Maroon', '#800000') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (18, 'Navy', '#000080') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (19, 'Silver', '#C0C0C0') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (20, 'Gold', '#FFD700') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (21, 'Indigo', '#4B0082') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (22, 'Violet', '#EE82EE') ON CONFLICT DO NOTHING;
INSERT INTO public.color (color_id, color_name, color_hex_code) VALUES (23, 'Turquoise', '#40E0D0') ON CONFLICT DO NOTHING;


--
-- TOC entry 5196 (class 0 OID 29039)
-- Dependencies: 250
-- Data for Name: product_status; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5194 (class 0 OID 29029)
-- Dependencies: 248
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('6cd78512-14bc-4abc-8fd7-9ab73da65009', 1, NULL, 'Nike Hyverse', 'NIK366', 'This Hyverse top has a classic fit. Its lightweight, sweat-wicking Dri-FIT material and flat seams give a smooth, comfortable feel—whether you''re taking on a quick lift or an intense workout session.', '2025-03-13 10:05:21.869959+07', '2025-03-13 10:05:21.869959+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('d03f6a84-ee3c-4d95-b69b-3d8d8bd911cb', 1, NULL, 'Nike Pro', 'NIK111', 'The Nike Pro collection is all about giving you the confidence to push past your personal goals. This slim-fitting top has a smooth and stretchy feel that suits your favourite sports and exercises. Plus, it offers a rounded hem for extra coverage or a secure feel when you tuck it into your bottoms.', '2025-03-13 10:27:06.165349+07', '2025-03-13 10:27:06.165349+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('59f365f8-6b08-4371-bba1-704183094580', 1, NULL, 'Nike Sportswear Chill Knit', 'NIK666', 'Perfect for any day, this slightly cropped, slim-fitting tee is classic and versatile. Our smooth jersey feels stretchy with a slight drape, giving it a comfortable, body-skimming feel.

', '2025-03-13 10:28:26.275925+07', '2025-03-13 10:28:26.275925+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('8c42cf04-119e-4e85-a715-88b9ae1e3027', 1, NULL, 'Nike Sportswear', 'NIK182', 'Made from midweight cotton and with a roomy fit, this tee gives you a perfectly relaxed look.', '2025-03-13 10:29:38.087714+07', '2025-03-13 10:29:38.087714+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('9b1ce21e-093f-4baf-8e9a-67797202e28c', 1, NULL, 'Nike Trail', 'NIK296', 'Nike Trail has the features you need to make connecting with your surroundings easier, even in dynamic conditions. With sweat-wicking tech and underarm gussets, this soft top is designed to help keep you comfortable wherever your path takes you.', '2025-03-13 10:30:34.07325+07', '2025-03-13 10:30:34.07325+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('ffd6b6c1-f6cc-4748-aace-1559ca29ad3b', 1, NULL, 'Nike Dri-FIT Stride', 'NIK819', 'Flex your speed, embrace the momentum. The Nike Dri-FIT Stride Shorts have a lightweight feel—made from at least 75% recycled polyester fibres—designed for unrestricted movement. They''re smooth to the touch, with extra breathability on the upper back. Need to take a phone along? We''ve got a pocket at the back geared just for your device.', '2025-03-13 10:34:59.650232+07', '2025-03-13 10:34:59.650232+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('7fc32388-41f9-44f0-8fc0-c64ef6dc6d07', 1, NULL, 'Nike Dri-FIT Challenger', 'NIK040', 'Designed for running, training and yoga, our sweat-wicking Challenger Shorts keep it light and cool with a relaxed fit that helps you get the most out of your movement. We geared them for more than just running—with a comfortable pocket that won''t irritate when you move from the track to the gym.', '2025-03-13 10:35:49.084238+07', '2025-03-13 10:35:49.084238+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('98d5edc5-5276-4b90-addf-81853d0d134a', 1, NULL, 'Nike DNA', 'NIK621', 'When the shot clock ticks down and the moment for a player to create their legend arrives, champions wear gear that helps them rise to the occasion. The DNA Shorts help you stay ready to enter the spotlight with innovative fabrics and performance-driven designs. They''re made from lightweight-yet-durable material that wicks sweat to keep you feeling dry and focused. They even offer a zip pocket to keep your essentials secure whether you''re on the court or off. Remember: champions stay ready.', '2025-03-13 10:39:05.077427+07', '2025-03-13 10:39:05.077427+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('f32a319a-6738-4353-967e-83a90878fe88', 1, NULL, 'Jordan MVP', 'JOR686', 'Classic and comfortable. These shorts are exactly what you need. Smooth on the outside and brushed soft on the inside, this lightweight fleece is an easy layer when you want a little extra warmth. An elastic waistband with drawcord makes securing your fit easy, even if you''re just lounging on the sofa.', '2025-03-13 10:41:34.269856+07', '2025-03-13 10:41:34.269856+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('207c8d97-eb6a-4833-bfd0-f91bf3797673', 1, NULL, 'Nike Challenger', 'NIK631', 'Based on the running shorts of the same name, the Challenger Trousers step up when you need more coverage for your workout. They''re lightweight, breathable and easy to get on and off thanks to their zip cuffs. Located in the centre of the back for comfort while running, the media pocket is big enough for most phones.', '2025-03-13 10:44:44.326452+07', '2025-03-13 10:44:44.326452+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('2c074d9d-b532-4d50-b984-50468a97806e', 1, NULL, 'Nike Sportswear Tech Fleece', 'NIK809', 'These comfy joggers bring back the signature slim fit you know for a tailored look. Our premium, smooth-on-both-sides fleece feels warmer and softer than ever, while keeping the same lightweight build you love. Tall, ribbed cuffs pair with a zip pocket on the right leg for secure storage and that signature Tech Fleece DNA. Pair them with the Tech Fleece hoodie for a uniform finish.', '2025-03-13 10:45:22.344658+07', '2025-03-13 10:45:22.344658+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('cdd8cdb4-46bd-4584-9c38-eb53bdfeed7c', 1, NULL, 'Liverpool F.C. Strike', 'LIV855', 'With design details specifically tailored for football''s rising stars, a slim, streamlined fit ensures that nothing comes between you and the ball. Sweat-wicking technology helps keep you cool and composed while you fine-tune your skills.', '2025-03-13 10:46:10.455765+07', '2025-03-13 10:46:10.455765+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('b8dac27a-5139-4ed4-a6dd-dc58438f50ec', 1, NULL, 'Men''s Balloon Trousers', 'MEN588', 'These super-roomy Nike Club trousers strike the perfect balance between casual comfort and versatile wearability. The smooth woven fabric offers a cool, lightweight feel.', '2025-03-13 10:47:04.24761+07', '2025-03-13 10:47:04.24761+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('219890f6-816d-4014-8bc7-a2c39a604b7e', 1, NULL, 'Men''s Dri-FIT Hooded Versatile Jacket', 'MEN192', 'Built for running, training and yoga, this stretchy, sweat-wicking jacket is designed to help you stay fresh through your entire workout. Cut with a relaxed feel, this hooded full-zip keeps your essentials close with pocket storage on the way to and from the gym.', '2025-03-13 10:48:48.308235+07', '2025-03-13 10:48:48.308235+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('49a3ea2e-bdb5-45cd-b9d8-5c05eeebf377', 1, NULL, 'Nike 24.7 ImpossiblySoft', 'NIK188', 'Extraordinarily soft and smooth, our ImpossiblySoft fabric feels made for all-day motion. This double-knit crew is built with clean lines and sweat-wicking Dri-FIT technology for the ultimate comfort on the go.', '2025-03-13 10:14:49.329763+07', '2025-03-13 10:14:49.329763+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('211f6ac6-0e31-4e72-8439-13095d2ec4cb', 1, NULL, 'NikeCourt Slam', 'NIK528', 'The slim-fit Slam polo helps you play at your peak without distraction. Ultra lightweight and highly breathable, its four-way stretch material helps manage sweat. Its buttonless collar, movement-friendly shoulder construction and extra coverage at the back help keep you covered, not constricted.', '2025-03-13 10:15:45.225856+07', '2025-03-13 10:15:45.225856+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('5c382301-fc45-4084-8d57-0d5555045f9d', 1, NULL, 'Nike Sportswear Premium Essentials', 'NIK695', 'The Nike Sportswear Long-Sleeve T-Shirt has a loose fit for a carefree, comfortable look. Its heavyweight organic cotton fabric feels thick and soft. A subtle Futura logo at the centre of the front of the T-Shirt offers a signature Nike look while a set-on collar ensures a clean, comfortable fit. This product is made from at least 75% organic cotton fibres.', '2025-03-13 10:16:52.017011+07', '2025-03-13 10:16:52.017011+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('d7f596e5-f5ef-4d9a-b1b7-817012a73308', 1, NULL, 'LeBron James Los Angeles Lakers 2024 Select Series', 'LEB262', 'Honouring league legends and rising stars, the Select Series celebrates the true artists of the game. Show your love for LeBron James and the Los Angeles Lakers.', '2025-03-13 10:20:39.807394+07', '2025-03-13 10:20:39.807394+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('2b4e07f4-afea-4095-85a3-596949571c87', 1, NULL, 'Nike Club', 'NIK197', 'A classic button-down built to bring crisp and clean Nike Club style to your look. It has a spacious, oversized fit with a touch of give in the fabric for even more comfort.', '2025-03-13 10:21:54.535877+07', '2025-03-13 10:21:54.535877+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('f3885e6a-e019-41d6-b387-919db606d4f8', 1, NULL, 'Nike Stride', 'NIK220', 'Using insights from runners like you, we prioritised functionality to refresh our Stride essentials. This lightweight tank top''s sweat-wicking knit is built with extra breathability, so you can stay focused on your pace', '2025-03-13 10:24:35.860976+07', '2025-03-13 10:24:35.860976+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('c701bcb2-edbc-481d-941b-f3ca5c362f7f', 1, NULL, 'Nike Dri-FIT Ready', 'NIK163', 'The sweat-wicking Ready Tank Top keeps you fresh for all your fitness activities. We gave it a relaxed fit with quick-drying, breathable fabric to help you stay cool when your workout heats up.', '2025-03-13 10:25:42.901558+07', '2025-03-13 10:25:42.901558+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('82ed9293-7122-4056-8eb5-e1d14065931d', 1, NULL, 'Men''s Repel UV Running Jacket', 'MEN268', 'Using insights from runners like you, we prioritised functionality to refresh our Stride essentials. Lightweight and water-repellent, this UV-blocking jacket packs into its own pocket, helping you stay ready for any weather.', '2025-03-13 10:50:00.747236+07', '2025-03-13 10:50:00.747236+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('d1a86ae6-c84e-422e-8396-62724e7a19d5', 1, NULL, 'Women''s Loose Woven Jacket', 'WOM696', 'Reaching back to our roots, we kept the original design lines of the Windrunner in this crinkle-woven jacket. Want to know more about the 26-degree chevron? Check out the interior label for a history lesson.', '2025-03-13 10:51:51.619322+07', '2025-03-13 10:51:51.619322+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('0876b245-1cbc-4d4e-90f0-d610bab1a7cd', 1, NULL, 'Women''s Woven Jacket', 'WOM341', 'Designed with simplicity and functionality in mind, this jacket has a cinchable waist and water-repellent coating on the crinkled fabric so you''re ready for anything.', '2025-03-13 10:50:44.620692+07', '2025-03-13 10:50:44.620692+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('1e0a1f5a-3193-45e4-a13c-71c3dcba7e54', 1, NULL, 'Therma-FIT Basketball Trousers', 'THE265', 'These Kobe Therma-FIT trousers have a premium dual-layer design featuring a mesh shell and brushed interior that''s built to keep you warm on and off the court.', '2025-03-13 10:53:05.98066+07', '2025-03-13 10:53:05.98066+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('eea8f26c-62c8-4d65-bbda-7d3908f2db9a', 2, NULL, '1AGTR1', '1AG688', 'Part of Maison''s spring collection', '2025-03-13 11:01:26.149881+07', '2025-03-13 11:01:26.149881+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('eb00179a-025a-41aa-a078-da76c9083d47', 2, NULL, '1AGTJ6', '1AG526', 'Part of Maison''s spring collection', '2025-03-13 11:03:05.315496+07', '2025-03-13 11:03:05.315496+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('dc390c37-83ea-47dc-86ef-8fc7b981789d', 3, NULL, 'BADGE TEE - FADED', 'BAD453', 'BADGE TEE - A new T-shirt with a basic design using the wash method to create impressive color tones. The highlight of the shirt is the new SWE logo pattern made of metal, delicately placed on the left chest. The collar, sleeves and hem have torn details to make your outfit stand out more', '2025-03-13 11:06:40.106011+07', '2025-03-13 11:06:40.106011+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('553573d1-bb99-4efb-8927-cc589aa791fd', 3, NULL, '10 TEE - BLACK', '10T124', '10 TEE - The new T-shirt in the SWE summer collection has just been released. The highlight of the shirt is the Kid Atelier motif embroidered with a chain on the front of the chest and the number 10 motif used in a fuzzy embroidered material on the back of the shirt.', '2025-03-13 11:07:52.23272+07', '2025-03-13 11:07:52.23272+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('966e898e-c222-4814-ada5-fa2c5cbec892', 3, NULL, 'LIFE TEE - BLACK', 'LIF583', 'LIFE TEE - The T-shirt with the French message "C''EST LA VIE" meaning "Life is like that" is embroidered with a chain on the front, creating a striking yet luxurious feel. The collar of the shirt is woven exclusively with extremely unique PE yarn.', '2025-03-13 11:08:56.437594+07', '2025-03-13 11:08:56.437594+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5200 (class 0 OID 29051)
-- Dependencies: 254
-- Data for Name: rank; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rank (rank_id, rank_name, rank_num, rank_payment_requirement, rank_base_discount) VALUES (1, 'Unranked', 1, 0.00, 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.rank (rank_id, rank_name, rank_num, rank_payment_requirement, rank_base_discount) VALUES (2, 'Bronze', 2, 1000000.00, 0.02) ON CONFLICT DO NOTHING;
INSERT INTO public.rank (rank_id, rank_name, rank_num, rank_payment_requirement, rank_base_discount) VALUES (3, 'Silver', 3, 5000000.00, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO public.rank (rank_id, rank_name, rank_num, rank_payment_requirement, rank_base_discount) VALUES (4, 'Gold', 4, 10000000.00, 0.07) ON CONFLICT DO NOTHING;
INSERT INTO public.rank (rank_id, rank_name, rank_num, rank_payment_requirement, rank_base_discount) VALUES (5, 'Diamond', 5, 30000000.00, 0.10) ON CONFLICT DO NOTHING;


--
-- TOC entry 5204 (class 0 OID 29063)
-- Dependencies: 258
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.role (role_id, role_name) VALUES (1, 'ADMIN') ON CONFLICT DO NOTHING;
INSERT INTO public.role (role_id, role_name) VALUES (2, 'CUSTOMER') ON CONFLICT DO NOTHING;
INSERT INTO public.role (role_id, role_name) VALUES (3, 'STAFF') ON CONFLICT DO NOTHING;


--
-- TOC entry 5215 (class 0 OID 29096)
-- Dependencies: 269
-- Data for Name: size; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.size (size_id, size_name) VALUES (1, 'S') ON CONFLICT DO NOTHING;
INSERT INTO public.size (size_id, size_name) VALUES (2, 'M') ON CONFLICT DO NOTHING;
INSERT INTO public.size (size_id, size_name) VALUES (3, 'L') ON CONFLICT DO NOTHING;
INSERT INTO public.size (size_id, size_name) VALUES (4, 'XL') ON CONFLICT DO NOTHING;
INSERT INTO public.size (size_id, size_name) VALUES (5, 'XXL') ON CONFLICT DO NOTHING;
INSERT INTO public.size (size_id, size_name) VALUES (6, 'XXXL') ON CONFLICT DO NOTHING;


--
-- TOC entry 5226 (class 0 OID 29129)
-- Dependencies: 280
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."user" (user_id, rank_id, role_id, is_user_enabled, user_google_id, user_username, user_password, user_fullname, user_email, user_phone, user_birthdate, user_address, user_image, user_current_payment_method, user_created_at, user_updated_at) VALUES ('16189846-2c32-4efc-9485-a1743727915f', 1, 2, true, '110384002791577902840', 'HauLT', '$2a$10$oRiK7N4psVTc5025bcr6b.QkTwi7zrMNaS5tZFO0QS0MDi3KGDGsW', 'HauLT', 'letrunghau2244@gmail.com', '0896679121', NULL, '', 'https://i.ibb.co/M5crZDR8/z6197539031181-4fe25592444b34aee49431f0658e8846.jpg', NULL, '2025-02-14 10:46:35.862+07', '2025-02-20 08:41:40.070733+07') ON CONFLICT DO NOTHING;
INSERT INTO public."user" (user_id, rank_id, role_id, is_user_enabled, user_google_id, user_username, user_password, user_fullname, user_email, user_phone, user_birthdate, user_address, user_image, user_current_payment_method, user_created_at, user_updated_at) VALUES ('e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 1, true, NULL, 'admin123', '$2a$10$wEpm7dyhEnwQJyafwPhIXOWbB/O8JEW9Fi4910ZECm2lolkJj4dmy', 'HauLT', '.@1', '0896679121', NULL, '', 'https://i.ibb.co/M5crZDR8/z6197539031181-4fe25592444b34aee49431f0658e8846.jpg', NULL, '2025-02-17 15:28:13.38+07', '2025-02-27 16:01:28.338067+07') ON CONFLICT DO NOTHING;
INSERT INTO public."user" (user_id, rank_id, role_id, is_user_enabled, user_google_id, user_username, user_password, user_fullname, user_email, user_phone, user_birthdate, user_address, user_image, user_current_payment_method, user_created_at, user_updated_at) VALUES ('2b26c797-2ccf-4b05-b1fd-b88759083359', 1, 2, true, '116647024808480724563', 'HauLTCE', '$2a$10$E15x5WDF0kLtcuouDIVuSO8V8ltV2h4z6B31wZp0t0G./oUNvY/JS', 'Le Trung Hau (K18 CT)', 'haultce180481@fpt.edu.vn', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocKioJ6Tfhu5K4ILDeKsIipg9Wv77NszLA-aFPKxqN2nXznSO8z1=s96-c', NULL, '2025-03-03 08:34:56.200551+07', '2025-03-03 08:34:56.200551+07') ON CONFLICT DO NOTHING;
INSERT INTO public."user" (user_id, rank_id, role_id, is_user_enabled, user_google_id, user_username, user_password, user_fullname, user_email, user_phone, user_birthdate, user_address, user_image, user_current_payment_method, user_created_at, user_updated_at) VALUES ('5a53b431-ec19-4631-a43b-91e3e619170b', 1, 3, true, NULL, 'staff123', '$2a$10$DfuCOI0wCBin3fleL8KCJe4qGlJbOC.eM7rz5basGg4fSGzFoXbHy', 'Staffu-chan', 'staff@staff.com', '0896679121', NULL, '', 'https://i.ibb.co/bMvPJ8dL/14.png', NULL, '2025-02-18 10:37:56.859+07', '2025-02-18 10:37:56.859+07') ON CONFLICT DO NOTHING;
INSERT INTO public."user" (user_id, rank_id, role_id, is_user_enabled, user_google_id, user_username, user_password, user_fullname, user_email, user_phone, user_birthdate, user_address, user_image, user_current_payment_method, user_created_at, user_updated_at) VALUES ('506ac7fd-3b2a-4c72-b105-5338898fda5d', NULL, 2, true, NULL, 'HauTest', '$2a$10$HGkjDC.l3oryRQi0CiD.he6C7uWw0o0i39Qv2AfcrZduLKAh3eWFK', 'Hau', '.@2', '0123456789', NULL, NULL, NULL, NULL, '2025-03-03 11:34:28.24995+07', '2025-03-03 11:34:28.24995+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5229 (class 0 OID 29144)
-- Dependencies: 283
-- Data for Name: variation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (4, '6cd78512-14bc-4abc-8fd7-9ab73da65009', 1, 9, 'https://i.ibb.co/cXw25qKx/3.png', 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (5, '49a3ea2e-bdb5-45cd-b9d8-5c05eeebf377', 4, 15, 'https://i.ibb.co/G4t7p9v1/5.png', 2499000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (6, '211f6ac6-0e31-4e72-8439-13095d2ec4cb', 2, 10, 'https://i.ibb.co/DgR6ZL8S/6.png', 2399000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (7, '5c382301-fc45-4084-8d57-0d5555045f9d', 3, 9, 'https://i.ibb.co/7h4QPDM/7.png', 1119000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (8, '6cd78512-14bc-4abc-8fd7-9ab73da65009', 2, 9, 'https://i.ibb.co/35ng9vPM/2.png', 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (9, '6cd78512-14bc-4abc-8fd7-9ab73da65009', 4, 9, 'https://i.ibb.co/m7hd8vh/4.png', 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (10, 'd7f596e5-f5ef-4d9a-b1b7-817012a73308', 3, 9, 'https://i.ibb.co/Y73YbV8Z/8.png', 3669000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (11, '2b4e07f4-afea-4095-85a3-596949571c87', 3, 20, 'https://i.ibb.co/spS7R8wm/9.png', 1739000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (12, 'f3885e6a-e019-41d6-b387-919db606d4f8', 4, 1, 'https://i.ibb.co/DH0ZzSY9/10.png', 1279000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (13, 'c701bcb2-edbc-481d-941b-f3ca5c362f7f', 4, 12, 'https://i.ibb.co/vCLbRWJ8/11.png', 1119000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (14, 'd03f6a84-ee3c-4d95-b69b-3d8d8bd911cb', 4, 9, 'https://i.ibb.co/xt1qDsKy/12.png', 659000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (15, '59f365f8-6b08-4371-bba1-704183094580', 1, 9, 'https://i.ibb.co/hRmPdXKz/13.png', 919000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (16, '8c42cf04-119e-4e85-a715-88b9ae1e3027', 3, 16, 'https://i.ibb.co/GvLJBX89/14.png', 1119000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (17, '9b1ce21e-093f-4baf-8e9a-67797202e28c', 2, 10, 'https://i.ibb.co/5XNckN5M/AS-W-NK-TRAIL-DF-SS-TOP.png', 1479000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (18, 'ffd6b6c1-f6cc-4748-aace-1559ca29ad3b', 4, 9, 'https://i.ibb.co/1GRYy9xL/AS-M-NK-DF-STRIDE-5-IN-BF-SHRT.png', 1279000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (19, '7fc32388-41f9-44f0-8fc0-c64ef6dc6d07', 4, 9, 'https://i.ibb.co/My2s6skc/AS-M-NK-DF-CHALLENGER-5-BF-SHO.png', 919000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (20, '98d5edc5-5276-4b90-addf-81853d0d134a', 4, 9, 'https://i.ibb.co/kVdh6CcM/535.png', 1119000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (21, 'f32a319a-6738-4353-967e-83a90878fe88', 4, 9, 'https://i.ibb.co/hJSkbw7j/M-J-MVP-FLC-SHORT.png', 1429000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (22, '207c8d97-eb6a-4833-bfd0-f91bf3797673', 3, 9, 'https://i.ibb.co/twBPMHdF/AS-M-NK-DF-CHALLENGR-WVN-PANT.png', 1739000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (23, '2c074d9d-b532-4d50-b984-50468a97806e', 4, 9, 'https://i.ibb.co/WNYQngT5/AS-M-NK-TCH-FLC-JGGR.png', 2859000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (24, 'cdd8cdb4-46bd-4584-9c38-eb53bdfeed7c', 4, 9, 'https://i.ibb.co/4ZVpMXQL/LFC-M-NK-DF-STRK-PANT-KPZ.png', 1839000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (25, 'b8dac27a-5139-4ed4-a6dd-dc58438f50ec', 3, 9, 'https://i.ibb.co/XfZQtPNZ/AS-M-NK-CLUB-BALLOON-PANT.png', 2189000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (26, '219890f6-816d-4014-8bc7-a2c39a604b7e', 4, 9, 'https://i.ibb.co/prBxKv76/AS-M-NK-DF-FORM-HD-JKT.png', 1579000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (27, '82ed9293-7122-4056-8eb5-e1d14065931d', 4, 12, 'https://i.ibb.co/BJmSV4T/AS-M-NK-UV-RPL-STRIDE-JACKET.png', 2859000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (28, '0876b245-1cbc-4d4e-90f0-d610bab1a7cd', 3, 16, 'https://i.ibb.co/1Jmdx0GY/AS-W-NSW-TREND-WVN-JKT-GCEL.png', 2759000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (29, 'd1a86ae6-c84e-422e-8396-62724e7a19d5', 3, 11, 'https://i.ibb.co/G4d4QWVD/AS-W-NSW-NK-WR-WVN-JKT-V2-K.png', 2859000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (30, '1e0a1f5a-3193-45e4-a13c-71c3dcba7e54', 4, 8, 'https://i.ibb.co/7JgDM45s/AS-KB-U-NK-TF-FUND-PANT.png', 1839000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (31, 'eea8f26c-62c8-4d65-bbda-7d3908f2db9a', 4, 9, 'https://i.ibb.co/q30JWnsW/louis-vuitton-leather-mix-varsit.png', 73500000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (36, 'eb00179a-025a-41aa-a078-da76c9083d47', 4, 9, 'https://i.ibb.co/nsgHmf2J/louis-vuitton-cotton-jersey-vars.png', 14400000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (37, 'dc390c37-83ea-47dc-86ef-8fc7b981789d', 3, 9, 'https://i.ibb.co/t0ns61x/1-1-1-f30f331b4eb548e0b4a94996ef.png', 418000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (38, '553573d1-bb99-4efb-8927-cc589aa791fd', 4, 9, 'https://i.ibb.co/7d8vKQHs/untitled-capture8850-954202b24e5.png', 418000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (39, '966e898e-c222-4814-ada5-fa2c5cbec892', 3, 9, 'https://i.ibb.co/W46RCbYK/swet74383-7d41dacc157b4e20b81d9e.png', 380000.00) ON CONFLICT DO NOTHING;


--
-- TOC entry 5165 (class 0 OID 28936)
-- Dependencies: 219
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5166 (class 0 OID 28941)
-- Dependencies: 220
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.category (category_id, category_name, category_description, category_image_url, category_created_at, category_updated_at) VALUES (1, 'T-Shirts', 'Comfortable cotton t-shirts', 'https://i.ibb.co/Kcy8gWCB/du-an-moi-9-1-2-1-0aae9e00-11ef.png', '2025-03-13 10:00:26.364244+07', '2025-03-13 10:00:26.364244+07') ON CONFLICT DO NOTHING;
INSERT INTO public.category (category_id, category_name, category_description, category_image_url, category_created_at, category_updated_at) VALUES (2, 'Tops', 'A sleeveless shirt, is a shirt that is manufactured without sleeves or with sleeves that have been cut off.', 'https://i.ibb.co/k213qf4R/tanktops.png', '2025-03-13 10:23:51.837058+07', '2025-03-13 10:23:51.837058+07') ON CONFLICT DO NOTHING;
INSERT INTO public.category (category_id, category_name, category_description, category_image_url, category_created_at, category_updated_at) VALUES (4, 'Shorts', 'Shorts are a garment worn over the pelvic area, circling the waist and splitting to cover the upper part of the legs...', 'https://i.ibb.co/Xk8TgGZS/1723824826414h4ln3p.png', '2025-03-13 10:33:54.097108+07', '2025-03-13 10:36:36.917867+07') ON CONFLICT DO NOTHING;
INSERT INTO public.category (category_id, category_name, category_description, category_image_url, category_created_at, category_updated_at) VALUES (5, 'Pants', 'Pants', 'https://i.ibb.co/7JL9w5j8/1-7a91d995-223d-4591-a04b-852315.png', '2025-03-13 10:43:45.71465+07', '2025-03-13 10:43:45.71465+07') ON CONFLICT DO NOTHING;
INSERT INTO public.category (category_id, category_name, category_description, category_image_url, category_created_at, category_updated_at) VALUES (6, 'Jackets', 'A jacket is a garment for the upper body, usually extending below the hips.', 'https://i.ibb.co/bMdNdD6L/Untitled-1.png', '2025-03-13 10:48:00.00955+07', '2025-03-13 10:48:00.00955+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5168 (class 0 OID 28947)
-- Dependencies: 222
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5230 (class 0 OID 29149)
-- Dependencies: 284
-- Data for Name: variation_single; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (1, 'NIK366-BLACK-S-695382', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (2, 'NIK366-BLACK-S-530814', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (3, 'NIK366-BLACK-S-992058', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (4, 'NIK366-BLACK-S-836059', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (5, 'NIK366-BLACK-S-515727', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (6, 'NIK366-BLACK-M-938842', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (7, 'NIK366-BLACK-M-440193', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (8, 'NIK366-BLACK-M-823435', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (9, 'NIK366-BLACK-M-926479', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (10, 'NIK366-BLACK-M-058508', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (11, 'NIK366-BLACK-XL-401015', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (12, 'NIK366-BLACK-XL-309062', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (13, 'NIK366-BLACK-XL-422807', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (14, 'NIK366-BLACK-XL-702291', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (15, 'NIK366-BLACK-XL-148318', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (16, 'NIK366-BLACK-XL-491256', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (17, 'NIK366-BLACK-XL-095745', true) ON CONFLICT DO NOTHING;


--
-- TOC entry 5202 (class 0 OID 29057)
-- Dependencies: 256
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.review (review_id, product_id, user_id, variation_single_id, review_rating) VALUES (1, '6cd78512-14bc-4abc-8fd7-9ab73da65009', '8c2f4e97-6f16-46a1-a0bb-7bb4f7414654', 3, 5) ON CONFLICT DO NOTHING;


--
-- TOC entry 5172 (class 0 OID 28957)
-- Dependencies: 226
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.comment (comment_id, review_id, comment_content, comment_created_at, comment_updated_at, parent_comment_id) VALUES (1, 1, 'Good', '2025-03-13 11:16:04.820267+07', '2025-03-13 11:16:04.820267+07', NULL) ON CONFLICT DO NOTHING;


--
-- TOC entry 5174 (class 0 OID 28963)
-- Dependencies: 228
-- Data for Name: comment_parent; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5177 (class 0 OID 28972)
-- Dependencies: 231
-- Data for Name: discount_status; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5179 (class 0 OID 28978)
-- Dependencies: 233
-- Data for Name: discount_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.discount_type (discount_type_id, discount_type_name) VALUES (1, 'PERCENTAGE') ON CONFLICT DO NOTHING;
INSERT INTO public.discount_type (discount_type_id, discount_type_name) VALUES (2, 'FIXED AMOUNT') ON CONFLICT DO NOTHING;


--
-- TOC entry 5175 (class 0 OID 28966)
-- Dependencies: 229
-- Data for Name: discount; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5220 (class 0 OID 29111)
-- Dependencies: 274
-- Data for Name: topic; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.topic (topic_id, topic_name) VALUES (1, 'Website navigation') ON CONFLICT DO NOTHING;
INSERT INTO public.topic (topic_id, topic_name) VALUES (2, 'Product presentation') ON CONFLICT DO NOTHING;
INSERT INTO public.topic (topic_id, topic_name) VALUES (3, 'Order & Checkout') ON CONFLICT DO NOTHING;
INSERT INTO public.topic (topic_id, topic_name) VALUES (4, 'Shipping & Delivery') ON CONFLICT DO NOTHING;
INSERT INTO public.topic (topic_id, topic_name) VALUES (5, 'Return policies') ON CONFLICT DO NOTHING;
INSERT INTO public.topic (topic_id, topic_name) VALUES (6, 'Others') ON CONFLICT DO NOTHING;


--
-- TOC entry 5181 (class 0 OID 28984)
-- Dependencies: 235
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5183 (class 0 OID 28990)
-- Dependencies: 237
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5185 (class 0 OID 28996)
-- Dependencies: 239
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5187 (class 0 OID 29002)
-- Dependencies: 241
-- Data for Name: notification_user; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5189 (class 0 OID 29012)
-- Dependencies: 243
-- Data for Name: order_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (1, 'PENDING') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (2, 'PROCESSING') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (3, 'COMPLETED') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (4, 'SHIPPED') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (5, 'CANCELLED') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (6, 'RETURNED') ON CONFLICT DO NOTHING;


--
-- TOC entry 5192 (class 0 OID 29023)
-- Dependencies: 246
-- Data for Name: payment_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.payment_method (payment_method_id, payment_method_name) VALUES (1, 'COD') ON CONFLICT DO NOTHING;
INSERT INTO public.payment_method (payment_method_id, payment_method_name) VALUES (2, 'VNPAY') ON CONFLICT DO NOTHING;
INSERT INTO public.payment_method (payment_method_id, payment_method_name) VALUES (3, 'PAYOS') ON CONFLICT DO NOTHING;
INSERT INTO public.payment_method (payment_method_id, payment_method_name) VALUES (4, 'TRANSFER') ON CONFLICT DO NOTHING;


--
-- TOC entry 5213 (class 0 OID 29090)
-- Dependencies: 267
-- Data for Name: shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.shipping_method (shipping_method_id, shipping_method_name) VALUES (1, 'EXPRESS') ON CONFLICT DO NOTHING;
INSERT INTO public.shipping_method (shipping_method_id, shipping_method_name) VALUES (2, 'STANDARD') ON CONFLICT DO NOTHING;


--
-- TOC entry 5188 (class 0 OID 29007)
-- Dependencies: 242
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."order" (order_id, user_id, order_status_id, payment_method_id, shipping_method_id, discount_id, incharge_employee_id, order_date, order_total_amount, order_tracking_number, order_note, order_billing_address, order_expected_delivery_date, order_transaction_reference, order_tax, order_created_at, order_updated_at) VALUES ('8107d1c1-01bf-4604-adbd-e0e2f7dce58f', '8c2f4e97-6f16-46a1-a0bb-7bb4f7414654', 3, 1, 1, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', '2025-03-13 11:15:27.983708+07', 3076994.00, 'TNPGKJPOXZ', '', 'qưeqwe, Bình Long, Châu Phú, An Giang', '2025-03-20 11:15:27.983+07', '9327983', 0.05, '2025-03-13 11:15:27.983708+07', '2025-03-13 11:15:53.886979+07') ON CONFLICT DO NOTHING;
INSERT INTO public."order" (order_id, user_id, order_status_id, payment_method_id, shipping_method_id, discount_id, incharge_employee_id, order_date, order_total_amount, order_tracking_number, order_note, order_billing_address, order_expected_delivery_date, order_transaction_reference, order_tax, order_created_at, order_updated_at) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', '8c2f4e97-6f16-46a1-a0bb-7bb4f7414654', 3, 1, 1, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', '2025-03-13 11:16:32.180963+07', 14285972.00, 'TNW1CYWYLH', '', 'ewrew, Khánh An, An Phú, An Giang', '2025-03-20 11:16:32.18+07', '9392180', 0.05, '2025-03-13 11:16:32.181956+07', '2025-03-13 11:16:39.53778+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5191 (class 0 OID 29018)
-- Dependencies: 245
-- Data for Name: order_variation_single; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('8107d1c1-01bf-4604-adbd-e0e2f7dce58f', 1, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('8107d1c1-01bf-4604-adbd-e0e2f7dce58f', 2, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('8107d1c1-01bf-4604-adbd-e0e2f7dce58f', 3, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 4, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 5, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 6, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 7, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 8, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 9, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 10, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 11, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 12, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 13, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 14, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 15, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 16, NULL, 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('b052b0d3-fecf-44b7-a1ff-9a49d3bc7905', 17, NULL, 1018998.00) ON CONFLICT DO NOTHING;


--
-- TOC entry 5195 (class 0 OID 29034)
-- Dependencies: 249
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product_category (product_id, category_id) VALUES ('6cd78512-14bc-4abc-8fd7-9ab73da65009', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('49a3ea2e-bdb5-45cd-b9d8-5c05eeebf377', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('211f6ac6-0e31-4e72-8439-13095d2ec4cb', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('5c382301-fc45-4084-8d57-0d5555045f9d', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('d7f596e5-f5ef-4d9a-b1b7-817012a73308', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('2b4e07f4-afea-4095-85a3-596949571c87', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('f3885e6a-e019-41d6-b387-919db606d4f8', 2) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('c701bcb2-edbc-481d-941b-f3ca5c362f7f', 2) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('d03f6a84-ee3c-4d95-b69b-3d8d8bd911cb', 2) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('59f365f8-6b08-4371-bba1-704183094580', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('8c42cf04-119e-4e85-a715-88b9ae1e3027', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('9b1ce21e-093f-4baf-8e9a-67797202e28c', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('ffd6b6c1-f6cc-4748-aace-1559ca29ad3b', 4) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('7fc32388-41f9-44f0-8fc0-c64ef6dc6d07', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('7fc32388-41f9-44f0-8fc0-c64ef6dc6d07', 4) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('98d5edc5-5276-4b90-addf-81853d0d134a', 4) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('f32a319a-6738-4353-967e-83a90878fe88', 4) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('207c8d97-eb6a-4833-bfd0-f91bf3797673', 5) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('2c074d9d-b532-4d50-b984-50468a97806e', 5) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('cdd8cdb4-46bd-4584-9c38-eb53bdfeed7c', 5) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('b8dac27a-5139-4ed4-a6dd-dc58438f50ec', 5) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('219890f6-816d-4014-8bc7-a2c39a604b7e', 6) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('82ed9293-7122-4056-8eb5-e1d14065931d', 6) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('0876b245-1cbc-4d4e-90f0-d610bab1a7cd', 6) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('d1a86ae6-c84e-422e-8396-62724e7a19d5', 6) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('1e0a1f5a-3193-45e4-a13c-71c3dcba7e54', 5) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('eea8f26c-62c8-4d65-bbda-7d3908f2db9a', 6) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('eb00179a-025a-41aa-a078-da76c9083d47', 6) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('dc390c37-83ea-47dc-86ef-8fc7b981789d', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('553573d1-bb99-4efb-8927-cc589aa791fd', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('966e898e-c222-4814-ada5-fa2c5cbec892', 1) ON CONFLICT DO NOTHING;


--
-- TOC entry 5198 (class 0 OID 29045)
-- Dependencies: 252
-- Data for Name: provider; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5209 (class 0 OID 29078)
-- Dependencies: 263
-- Data for Name: sale_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sale_status (sale_status_id, sale_status_name) VALUES (1, 'INACTIVE') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_status (sale_status_id, sale_status_name) VALUES (2, 'ACTIVE') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_status (sale_status_id, sale_status_name) VALUES (3, 'EXPIRED') ON CONFLICT DO NOTHING;


--
-- TOC entry 5211 (class 0 OID 29084)
-- Dependencies: 265
-- Data for Name: sale_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sale_type (sale_type_id, sale_type_name) VALUES (1, 'PERCENTAGE') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_type (sale_type_id, sale_type_name) VALUES (2, 'FIXED AMOUNT') ON CONFLICT DO NOTHING;


--
-- TOC entry 5206 (class 0 OID 29069)
-- Dependencies: 260
-- Data for Name: sale; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sale (sale_id, sale_type_id, sale_status_id, sale_value, sale_start_date, sale_end_date, sale_created_at, sale_updated_at) VALUES (1, 1, 2, 18.00, '2025-03-13 11:09:00+07', '2025-04-14 11:09:00+07', '2025-03-13 11:09:45.631804+07', '2025-03-13 11:09:51.042317+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5207 (class 0 OID 29072)
-- Dependencies: 261
-- Data for Name: sale_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sale_product (sale_id, product_id) VALUES (1, '966e898e-c222-4814-ada5-fa2c5cbec892') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (1, '553573d1-bb99-4efb-8927-cc589aa791fd') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (1, 'dc390c37-83ea-47dc-86ef-8fc7b981789d') ON CONFLICT DO NOTHING;


--
-- TOC entry 5217 (class 0 OID 29102)
-- Dependencies: 271
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.stock (stock_id, stock_name, stock_address) VALUES (2, 'Unleashed VL', 'Bình Minh, Vĩnh Long') ON CONFLICT DO NOTHING;
INSERT INTO public.stock (stock_id, stock_name, stock_address) VALUES (1, 'Unleashed CT', 'Ninh Kiều, Cần Thơ') ON CONFLICT DO NOTHING;
INSERT INTO public.stock (stock_id, stock_name, stock_address) VALUES (3, 'Unleashed ST', 'Sóc Trăng, Sóc Trăng') ON CONFLICT DO NOTHING;
INSERT INTO public.stock (stock_id, stock_name, stock_address) VALUES (4, 'Unleashed DT', 'Châu Thành, Đồng Tháp') ON CONFLICT DO NOTHING;
INSERT INTO public.stock (stock_id, stock_name, stock_address) VALUES (5, 'Unleashed BL', 'Bảo Lộc, Lâm Đồng') ON CONFLICT DO NOTHING;


--
-- TOC entry 5219 (class 0 OID 29108)
-- Dependencies: 273
-- Data for Name: stock_variation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (37, 2, 21) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (38, 2, 16) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (39, 2, 44) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (4, 2, 8) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (8, 2, 15) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (9, 2, 16) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (11, 2, 50) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (12, 2, 20) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (13, 2, 35) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (14, 2, 20) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (15, 2, 16) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (16, 2, 23) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (17, 2, 20) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (18, 2, 15) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (27, 2, 100) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (28, 2, 110) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (29, 2, 125) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (31, 2, 145) ON CONFLICT DO NOTHING;


--
-- TOC entry 5224 (class 0 OID 29123)
-- Dependencies: 278
-- Data for Name: transaction_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transaction_type (transaction_type_id, transaction_type_name) VALUES (1, 'IN') ON CONFLICT DO NOTHING;
INSERT INTO public.transaction_type (transaction_type_id, transaction_type_name) VALUES (2, 'OUT') ON CONFLICT DO NOTHING;


--
-- TOC entry 5222 (class 0 OID 29117)
-- Dependencies: 276
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (4, 2, 39, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 19, '2025-03-13', 380000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (5, 2, 37, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 21, '2025-03-13', 418000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (6, 2, 38, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 16, '2025-03-13', 418000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (7, 2, 39, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 25, '2025-03-13', 380000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (8, 2, 4, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 8, '2025-03-13', 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (9, 2, 8, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 15, '2025-03-13', 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (10, 2, 9, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 16, '2025-03-13', 1018998.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (11, 2, 11, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 50, '2025-03-13', 1739000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (12, 2, 12, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 20, '2025-03-13', 1279000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (13, 2, 13, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 35, '2025-03-13', 1119000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (14, 2, 14, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 20, '2025-03-13', 659000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (15, 2, 15, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 16, '2025-03-13', 919000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (16, 2, 16, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 23, '2025-03-13', 1119000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (17, 2, 17, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 20, '2025-03-13', 1479000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (18, 2, 18, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 15, '2025-03-13', 1279000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (19, 2, 27, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 100, '2025-03-13', 2859000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (20, 2, 28, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 110, '2025-03-13', 2759000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (21, 2, 29, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 125, '2025-03-13', 2859000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (22, 2, 31, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 145, '2025-03-13', 73500000.00) ON CONFLICT DO NOTHING;


--
-- TOC entry 5227 (class 0 OID 29134)
-- Dependencies: 281
-- Data for Name: user_discount; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5228 (class 0 OID 29139)
-- Dependencies: 282
-- Data for Name: user_rank; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_rank (user_id, rank_id, money_spent, rank_status, rank_expire_date, rank_created_date, rank_updated_date) VALUES ('8c2f4e97-6f16-46a1-a0bb-7bb4f7414654', 1, 0.00, 1, '2025-03-13', '2025-03-13 11:13:18.511808+07', '2025-03-13 11:13:18.511808+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5233 (class 0 OID 29156)
-- Dependencies: 287
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 218
-- Name: brand_brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brand_brand_id_seq', 3, true);


--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 221
-- Name: category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_category_id_seq', 6, true);


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 223
-- Name: chat_chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_chat_id_seq', 1, false);


--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 225
-- Name: color_color_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.color_color_id_seq', 1, false);


--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 227
-- Name: comment_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_comment_id_seq', 1, true);


--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 230
-- Name: discount_discount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discount_discount_id_seq', 1, false);


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 232
-- Name: discount_status_discount_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discount_status_discount_status_id_seq', 1, false);


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 234
-- Name: discount_type_discount_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discount_type_discount_type_id_seq', 1, false);


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 236
-- Name: feedback_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedback_feedback_id_seq', 1, false);


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 238
-- Name: message_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.message_message_id_seq', 1, false);


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 240
-- Name: notification_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_notification_id_seq', 1, false);


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 244
-- Name: order_status_order_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_status_order_status_id_seq', 1, false);


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 247
-- Name: payment_method_payment_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_method_payment_method_id_seq', 1, false);


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 251
-- Name: product_status_product_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_status_product_status_id_seq', 1, false);


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 253
-- Name: provider_provider_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.provider_provider_id_seq', 1, false);


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 255
-- Name: rank_rank_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rank_rank_id_seq', 1, false);


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 257
-- Name: review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_review_id_seq', 1, true);


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 259
-- Name: role_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_role_id_seq', 1, false);


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 262
-- Name: sale_sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sale_sale_id_seq', 1, true);


--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 264
-- Name: sale_status_sale_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sale_status_sale_status_id_seq', 1, false);


--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 266
-- Name: sale_type_sale_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sale_type_sale_type_id_seq', 1, false);


--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 268
-- Name: shipping_method_shipping_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shipping_method_shipping_method_id_seq', 1, false);


--
-- TOC entry 5261 (class 0 OID 0)
-- Dependencies: 270
-- Name: size_size_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.size_size_id_seq', 1, false);


--
-- TOC entry 5262 (class 0 OID 0)
-- Dependencies: 272
-- Name: stock_stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_stock_id_seq', 1, false);


--
-- TOC entry 5263 (class 0 OID 0)
-- Dependencies: 275
-- Name: topic_topic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.topic_topic_id_seq', 1, false);


--
-- TOC entry 5264 (class 0 OID 0)
-- Dependencies: 277
-- Name: transaction_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_transaction_id_seq', 22, true);


--
-- TOC entry 5265 (class 0 OID 0)
-- Dependencies: 279
-- Name: transaction_type_transaction_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_type_transaction_type_id_seq', 1, false);


--
-- TOC entry 5266 (class 0 OID 0)
-- Dependencies: 285
-- Name: variation_single_variation_single_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.variation_single_variation_single_id_seq', 17, true);


--
-- TOC entry 5267 (class 0 OID 0)
-- Dependencies: 286
-- Name: variation_variation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.variation_variation_id_seq', 39, true);


-- Completed on 2025-03-13 11:33:26

--
-- PostgreSQL database dump complete
--


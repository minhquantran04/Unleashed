--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-03-13 08:32:52

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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 25064)
-- Name: brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brand (
    brand_id integer NOT NULL,
    brand_name character varying(255),
    brand_description text,
    brand_image_url character varying(255),
    brand_website_url character varying(255),
    brand_created_at timestamp with time zone,
    brand_updated_at timestamp with time zone
);


ALTER TABLE public.brand OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 25069)
-- Name: brand_brand_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brand_brand_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brand_brand_id_seq OWNER TO postgres;

--
-- TOC entry 5316 (class 0 OID 0)
-- Dependencies: 218
-- Name: brand_brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brand_brand_id_seq OWNED BY public.brand.brand_id;


--
-- TOC entry 219 (class 1259 OID 25070)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    user_id character varying NOT NULL,
    variation_id integer NOT NULL,
    cart_quantity integer
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25075)
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    category_id integer NOT NULL,
    category_name character varying(255),
    category_description text,
    category_image_url character varying(255),
    category_created_at timestamp with time zone,
    category_updated_at timestamp with time zone
);


ALTER TABLE public.category OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25080)
-- Name: category_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_category_id_seq OWNER TO postgres;

--
-- TOC entry 5317 (class 0 OID 0)
-- Dependencies: 221
-- Name: category_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_category_id_seq OWNED BY public.category.category_id;


--
-- TOC entry 222 (class 1259 OID 25081)
-- Name: chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat (
    chat_id integer NOT NULL,
    user_id character varying(255),
    chat_created_at timestamp with time zone
);


ALTER TABLE public.chat OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25086)
-- Name: chat_chat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_chat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_chat_id_seq OWNER TO postgres;

--
-- TOC entry 5318 (class 0 OID 0)
-- Dependencies: 223
-- Name: chat_chat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_chat_id_seq OWNED BY public.chat.chat_id;


--
-- TOC entry 224 (class 1259 OID 25087)
-- Name: color; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.color (
    color_id integer NOT NULL,
    color_name character varying,
    color_hex_code character varying
);


ALTER TABLE public.color OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25092)
-- Name: color_color_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.color_color_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.color_color_id_seq OWNER TO postgres;

--
-- TOC entry 5319 (class 0 OID 0)
-- Dependencies: 225
-- Name: color_color_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.color_color_id_seq OWNED BY public.color.color_id;


--
-- TOC entry 226 (class 1259 OID 25093)
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment (
    comment_id integer NOT NULL,
    review_id integer,
    comment_content text,
    comment_created_at timestamp with time zone,
    comment_updated_at timestamp with time zone,
    parent_comment_id integer
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25098)
-- Name: comment_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_comment_id_seq OWNER TO postgres;

--
-- TOC entry 5320 (class 0 OID 0)
-- Dependencies: 227
-- Name: comment_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_comment_id_seq OWNED BY public.comment.comment_id;


--
-- TOC entry 228 (class 1259 OID 25099)
-- Name: comment_parent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment_parent (
    comment_id integer,
    comment_parent_id integer
);


ALTER TABLE public.comment_parent OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 25102)
-- Name: discount; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discount (
    discount_id integer NOT NULL,
    discount_status_id integer,
    discount_type_id integer,
    discount_code character varying(20) NOT NULL,
    discount_value numeric(10,2),
    discount_description text,
    discount_rank_requirement integer,
    discount_minimum_order_value numeric(10,2),
    discount_maximum_value numeric(10,2),
    discount_usage_limit integer,
    discount_start_date timestamp with time zone,
    discount_end_date timestamp with time zone,
    discount_created_at timestamp with time zone,
    discount_updated_at timestamp with time zone,
    discount_usage_count integer
);


ALTER TABLE public.discount OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 25107)
-- Name: discount_discount_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.discount_discount_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.discount_discount_id_seq OWNER TO postgres;

--
-- TOC entry 5321 (class 0 OID 0)
-- Dependencies: 230
-- Name: discount_discount_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.discount_discount_id_seq OWNED BY public.discount.discount_id;


--
-- TOC entry 231 (class 1259 OID 25108)
-- Name: discount_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discount_status (
    discount_status_id integer NOT NULL,
    discount_status_name character varying
);


ALTER TABLE public.discount_status OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 25113)
-- Name: discount_status_discount_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.discount_status_discount_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.discount_status_discount_status_id_seq OWNER TO postgres;

--
-- TOC entry 5322 (class 0 OID 0)
-- Dependencies: 232
-- Name: discount_status_discount_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.discount_status_discount_status_id_seq OWNED BY public.discount_status.discount_status_id;


--
-- TOC entry 233 (class 1259 OID 25114)
-- Name: discount_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discount_type (
    discount_type_id integer NOT NULL,
    discount_type_name character varying
);


ALTER TABLE public.discount_type OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 25119)
-- Name: discount_type_discount_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.discount_type_discount_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.discount_type_discount_type_id_seq OWNER TO postgres;

--
-- TOC entry 5323 (class 0 OID 0)
-- Dependencies: 234
-- Name: discount_type_discount_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.discount_type_discount_type_id_seq OWNED BY public.discount_type.discount_type_id;


--
-- TOC entry 235 (class 1259 OID 25120)
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    feedback_id integer NOT NULL,
    topic_id integer,
    feedback_email character varying,
    feedback_content text,
    feedback_created_at timestamp with time zone,
    is_feedback_resolved boolean
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 25125)
-- Name: feedback_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feedback_feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feedback_feedback_id_seq OWNER TO postgres;

--
-- TOC entry 5324 (class 0 OID 0)
-- Dependencies: 236
-- Name: feedback_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feedback_feedback_id_seq OWNED BY public.feedback.feedback_id;


--
-- TOC entry 237 (class 1259 OID 25126)
-- Name: message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.message (
    message_id integer NOT NULL,
    chat_id integer,
    sender_id character varying(255),
    message_text text,
    message_send_at timestamp with time zone,
    message_image_url character varying(255),
    is_message_edited boolean,
    is_message_deleted boolean
);


ALTER TABLE public.message OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 25131)
-- Name: message_message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.message_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.message_message_id_seq OWNER TO postgres;

--
-- TOC entry 5325 (class 0 OID 0)
-- Dependencies: 238
-- Name: message_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.message_message_id_seq OWNED BY public.message.message_id;


--
-- TOC entry 239 (class 1259 OID 25132)
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    notification_id integer NOT NULL,
    user_id_sender character varying(255),
    notification_title character varying,
    notification_content text,
    is_notification_draft boolean,
    notification_created_at timestamp with time zone,
    notification_updated_at timestamp with time zone
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 25137)
-- Name: notification_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_notification_id_seq OWNER TO postgres;

--
-- TOC entry 5326 (class 0 OID 0)
-- Dependencies: 240
-- Name: notification_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_notification_id_seq OWNED BY public.notification.notification_id;


--
-- TOC entry 241 (class 1259 OID 25138)
-- Name: notification_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_user (
    notification_id integer,
    user_id character varying,
    is_notification_viewed boolean,
    is_notification_deleted boolean
);


ALTER TABLE public.notification_user OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 25143)
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    order_id character varying NOT NULL,
    user_id character varying,
    order_status_id integer,
    payment_method_id integer,
    shipping_method_id integer,
    discount_id integer,
    incharge_employee_id character varying,
    order_date timestamp with time zone,
    order_total_amount numeric(10,2),
    order_tracking_number character varying(50),
    order_note text,
    order_billing_address character varying(255),
    order_expected_delivery_date timestamp with time zone,
    order_transaction_reference character varying(255),
    order_tax numeric(3,2),
    order_created_at timestamp with time zone,
    order_updated_at timestamp with time zone
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 25148)
-- Name: order_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_status (
    order_status_id integer NOT NULL,
    order_status_name character varying
);


ALTER TABLE public.order_status OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 25153)
-- Name: order_status_order_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_status_order_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_status_order_status_id_seq OWNER TO postgres;

--
-- TOC entry 5327 (class 0 OID 0)
-- Dependencies: 244
-- Name: order_status_order_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_status_order_status_id_seq OWNED BY public.order_status.order_status_id;


--
-- TOC entry 245 (class 1259 OID 25154)
-- Name: order_variation_single; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_variation_single (
    order_id character varying NOT NULL,
    variation_single_id integer NOT NULL,
    sale_id integer,
    variation_price_at_purchase numeric(10,2) NOT NULL
);


ALTER TABLE public.order_variation_single OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 25159)
-- Name: payment_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_method (
    payment_method_id integer NOT NULL,
    payment_method_name character varying
);


ALTER TABLE public.payment_method OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 25164)
-- Name: payment_method_payment_method_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_method_payment_method_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_method_payment_method_id_seq OWNER TO postgres;

--
-- TOC entry 5328 (class 0 OID 0)
-- Dependencies: 247
-- Name: payment_method_payment_method_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_method_payment_method_id_seq OWNED BY public.payment_method.payment_method_id;


--
-- TOC entry 248 (class 1259 OID 25165)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    product_id character varying NOT NULL,
    brand_id integer,
    product_status_id integer,
    product_name character varying,
    product_code character varying,
    product_description text,
    product_created_at timestamp with time zone,
    product_updated_at timestamp with time zone
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 25170)
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    product_id character varying,
    category_id integer
);


ALTER TABLE public.product_category OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 25175)
-- Name: product_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_status (
    product_status_id integer NOT NULL,
    product_status_name character varying
);


ALTER TABLE public.product_status OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 25180)
-- Name: product_status_product_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_status_product_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_status_product_status_id_seq OWNER TO postgres;

--
-- TOC entry 5329 (class 0 OID 0)
-- Dependencies: 251
-- Name: product_status_product_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_status_product_status_id_seq OWNED BY public.product_status.product_status_id;


--
-- TOC entry 252 (class 1259 OID 25181)
-- Name: provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provider (
    provider_id integer NOT NULL,
    provider_name character varying(255),
    provider_image_url character varying(255),
    provider_email character varying(255),
    provider_phone character varying(12),
    provider_address character varying(255),
    provider_created_at timestamp with time zone,
    provider_updated_at timestamp with time zone
);


ALTER TABLE public.provider OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 25186)
-- Name: provider_provider_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.provider_provider_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.provider_provider_id_seq OWNER TO postgres;

--
-- TOC entry 5330 (class 0 OID 0)
-- Dependencies: 253
-- Name: provider_provider_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.provider_provider_id_seq OWNED BY public.provider.provider_id;


--
-- TOC entry 254 (class 1259 OID 25187)
-- Name: rank; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rank (
    rank_id integer NOT NULL,
    rank_name character varying,
    rank_num integer,
    rank_payment_requirement numeric(10,2),
    rank_base_discount numeric(3,2)
);


ALTER TABLE public.rank OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 25192)
-- Name: rank_rank_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rank_rank_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rank_rank_id_seq OWNER TO postgres;

--
-- TOC entry 5331 (class 0 OID 0)
-- Dependencies: 255
-- Name: rank_rank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rank_rank_id_seq OWNED BY public.rank.rank_id;


--
-- TOC entry 256 (class 1259 OID 25193)
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    review_id integer NOT NULL,
    product_id character varying,
    user_id character varying,
	order_id character varying,
    review_rating integer
);


ALTER TABLE public.review OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 25198)
-- Name: review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_review_id_seq OWNER TO postgres;

--
-- TOC entry 5332 (class 0 OID 0)
-- Dependencies: 257
-- Name: review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_review_id_seq OWNED BY public.review.review_id;


--
-- TOC entry 258 (class 1259 OID 25199)
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    role_id integer NOT NULL,
    role_name character varying
);


ALTER TABLE public.role OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 25204)
-- Name: role_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_role_id_seq OWNER TO postgres;

--
-- TOC entry 5333 (class 0 OID 0)
-- Dependencies: 259
-- Name: role_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_role_id_seq OWNED BY public.role.role_id;


--
-- TOC entry 260 (class 1259 OID 25205)
-- Name: sale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sale (
    sale_id integer NOT NULL,
    sale_type_id integer,
    sale_status_id integer,
    sale_value numeric(10,2),
    sale_start_date timestamp with time zone,
    sale_end_date timestamp with time zone,
    sale_created_at timestamp with time zone,
    sale_updated_at timestamp with time zone
);


ALTER TABLE public.sale OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 25208)
-- Name: sale_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sale_product (
    sale_id integer NOT NULL,
    product_id character varying NOT NULL
);


ALTER TABLE public.sale_product OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 25213)
-- Name: sale_sale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sale_sale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sale_sale_id_seq OWNER TO postgres;

--
-- TOC entry 5334 (class 0 OID 0)
-- Dependencies: 262
-- Name: sale_sale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sale_sale_id_seq OWNED BY public.sale.sale_id;


--
-- TOC entry 263 (class 1259 OID 25214)
-- Name: sale_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sale_status (
    sale_status_id integer NOT NULL,
    sale_status_name character varying
);


ALTER TABLE public.sale_status OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 25219)
-- Name: sale_status_sale_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sale_status_sale_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sale_status_sale_status_id_seq OWNER TO postgres;

--
-- TOC entry 5335 (class 0 OID 0)
-- Dependencies: 264
-- Name: sale_status_sale_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sale_status_sale_status_id_seq OWNED BY public.sale_status.sale_status_id;


--
-- TOC entry 265 (class 1259 OID 25220)
-- Name: sale_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sale_type (
    sale_type_id integer NOT NULL,
    sale_type_name character varying
);


ALTER TABLE public.sale_type OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 25225)
-- Name: sale_type_sale_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sale_type_sale_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sale_type_sale_type_id_seq OWNER TO postgres;

--
-- TOC entry 5336 (class 0 OID 0)
-- Dependencies: 266
-- Name: sale_type_sale_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sale_type_sale_type_id_seq OWNED BY public.sale_type.sale_type_id;


--
-- TOC entry 267 (class 1259 OID 25226)
-- Name: shipping_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_method (
    shipping_method_id integer NOT NULL,
    shipping_method_name character varying
);


ALTER TABLE public.shipping_method OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 25231)
-- Name: shipping_method_shipping_method_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shipping_method_shipping_method_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shipping_method_shipping_method_id_seq OWNER TO postgres;

--
-- TOC entry 5337 (class 0 OID 0)
-- Dependencies: 268
-- Name: shipping_method_shipping_method_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shipping_method_shipping_method_id_seq OWNED BY public.shipping_method.shipping_method_id;


--
-- TOC entry 269 (class 1259 OID 25232)
-- Name: size; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.size (
    size_id integer NOT NULL,
    size_name character varying
);


ALTER TABLE public.size OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 25237)
-- Name: size_size_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.size_size_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.size_size_id_seq OWNER TO postgres;

--
-- TOC entry 5338 (class 0 OID 0)
-- Dependencies: 270
-- Name: size_size_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.size_size_id_seq OWNED BY public.size.size_id;


--
-- TOC entry 271 (class 1259 OID 25238)
-- Name: stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock (
    stock_id integer NOT NULL,
    stock_name character varying,
    stock_address character varying
);


ALTER TABLE public.stock OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 25243)
-- Name: stock_stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_stock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_stock_id_seq OWNER TO postgres;

--
-- TOC entry 5339 (class 0 OID 0)
-- Dependencies: 272
-- Name: stock_stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_stock_id_seq OWNED BY public.stock.stock_id;


--
-- TOC entry 273 (class 1259 OID 25244)
-- Name: stock_variation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_variation (
    variation_id integer NOT NULL,
    stock_id integer NOT NULL,
    stock_quantity integer
);


ALTER TABLE public.stock_variation OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 25247)
-- Name: topic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topic (
    topic_id integer NOT NULL,
    topic_name character varying
);


ALTER TABLE public.topic OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 25252)
-- Name: topic_topic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.topic_topic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.topic_topic_id_seq OWNER TO postgres;

--
-- TOC entry 5340 (class 0 OID 0)
-- Dependencies: 275
-- Name: topic_topic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.topic_topic_id_seq OWNED BY public.topic.topic_id;


--
-- TOC entry 276 (class 1259 OID 25253)
-- Name: transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction (
    transaction_id integer NOT NULL,
    stock_id integer,
    variation_id integer,
    provider_id integer,
    incharge_employee_id character varying,
    transaction_type_id integer,
    transaction_quantity integer,
    transaction_date date,
    transaction_product_price numeric(10,2)
);


ALTER TABLE public.transaction OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 25258)
-- Name: transaction_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_transaction_id_seq OWNER TO postgres;

--
-- TOC entry 5341 (class 0 OID 0)
-- Dependencies: 277
-- Name: transaction_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaction_transaction_id_seq OWNED BY public.transaction.transaction_id;


--
-- TOC entry 278 (class 1259 OID 25259)
-- Name: transaction_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_type (
    transaction_type_id integer NOT NULL,
    transaction_type_name character varying
);


ALTER TABLE public.transaction_type OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 25264)
-- Name: transaction_type_transaction_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_type_transaction_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_type_transaction_type_id_seq OWNER TO postgres;

--
-- TOC entry 5342 (class 0 OID 0)
-- Dependencies: 279
-- Name: transaction_type_transaction_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaction_type_transaction_type_id_seq OWNED BY public.transaction_type.transaction_type_id;


--
-- TOC entry 280 (class 1259 OID 25265)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    user_id character varying NOT NULL,
    role_id integer,
    is_user_enabled boolean,
    user_google_id character varying,
    user_username character varying,
    user_password character varying,
    user_fullname character varying,
    user_email character varying,
    user_phone character varying(12),
    user_birthdate character varying,
    user_address character varying,
    user_image character varying,
    user_current_payment_method character varying,
    user_created_at timestamp with time zone,
    user_updated_at timestamp with time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 25270)
-- Name: user_discount; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_discount (
    user_id character varying NOT NULL,
    discount_id integer NOT NULL,
    is_discount_used boolean NOT NULL,
    discount_used_at timestamp with time zone
);


ALTER TABLE public.user_discount OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 25275)
-- Name: user_rank; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_rank (
    user_id character varying NOT NULL,
    rank_id integer NOT NULL,
    money_spent numeric(10,2),
    rank_status smallint NOT NULL,
    rank_expire_date date NOT NULL,
    rank_created_date timestamp with time zone NOT NULL,
    rank_updated_date timestamp with time zone NOT NULL
);


ALTER TABLE public.user_rank OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 25280)
-- Name: variation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.variation (
    variation_id integer NOT NULL,
    product_id character varying,
    size_id integer,
    color_id integer,
    variation_image character varying,
    variation_price numeric(10,2)
);


ALTER TABLE public.variation OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 25285)
-- Name: variation_single; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.variation_single (
    variation_single_id integer NOT NULL,
    variation_single_code character varying,
    is_variation_single_bought boolean
);


ALTER TABLE public.variation_single OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 25290)
-- Name: variation_single_variation_single_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.variation_single_variation_single_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.variation_single_variation_single_id_seq OWNER TO postgres;

--
-- TOC entry 5343 (class 0 OID 0)
-- Dependencies: 285
-- Name: variation_single_variation_single_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.variation_single_variation_single_id_seq OWNED BY public.variation_single.variation_single_id;


--
-- TOC entry 286 (class 1259 OID 25291)
-- Name: variation_variation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.variation_variation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.variation_variation_id_seq OWNER TO postgres;

--
-- TOC entry 5344 (class 0 OID 0)
-- Dependencies: 286
-- Name: variation_variation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.variation_variation_id_seq OWNED BY public.variation.variation_id;


--
-- TOC entry 287 (class 1259 OID 25292)
-- Name: wishlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist (
    user_id character varying,
    product_id character varying
);


ALTER TABLE public.wishlist OWNER TO postgres;

--
-- TOC entry 4934 (class 2604 OID 25297)
-- Name: brand brand_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand ALTER COLUMN brand_id SET DEFAULT nextval('public.brand_brand_id_seq'::regclass);


--
-- TOC entry 4935 (class 2604 OID 25298)
-- Name: category category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN category_id SET DEFAULT nextval('public.category_category_id_seq'::regclass);


--
-- TOC entry 4936 (class 2604 OID 25299)
-- Name: chat chat_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat ALTER COLUMN chat_id SET DEFAULT nextval('public.chat_chat_id_seq'::regclass);


--
-- TOC entry 4937 (class 2604 OID 25300)
-- Name: color color_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.color ALTER COLUMN color_id SET DEFAULT nextval('public.color_color_id_seq'::regclass);


--
-- TOC entry 4938 (class 2604 OID 25301)
-- Name: comment comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment ALTER COLUMN comment_id SET DEFAULT nextval('public.comment_comment_id_seq'::regclass);


--
-- TOC entry 4939 (class 2604 OID 25302)
-- Name: discount discount_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount ALTER COLUMN discount_id SET DEFAULT nextval('public.discount_discount_id_seq'::regclass);


--
-- TOC entry 4940 (class 2604 OID 25303)
-- Name: discount_status discount_status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_status ALTER COLUMN discount_status_id SET DEFAULT nextval('public.discount_status_discount_status_id_seq'::regclass);


--
-- TOC entry 4941 (class 2604 OID 25304)
-- Name: discount_type discount_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_type ALTER COLUMN discount_type_id SET DEFAULT nextval('public.discount_type_discount_type_id_seq'::regclass);


--
-- TOC entry 4942 (class 2604 OID 25305)
-- Name: feedback feedback_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback ALTER COLUMN feedback_id SET DEFAULT nextval('public.feedback_feedback_id_seq'::regclass);


--
-- TOC entry 4943 (class 2604 OID 25306)
-- Name: message message_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message ALTER COLUMN message_id SET DEFAULT nextval('public.message_message_id_seq'::regclass);


--
-- TOC entry 4944 (class 2604 OID 25307)
-- Name: notification notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification ALTER COLUMN notification_id SET DEFAULT nextval('public.notification_notification_id_seq'::regclass);


--
-- TOC entry 4945 (class 2604 OID 25308)
-- Name: order_status order_status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status ALTER COLUMN order_status_id SET DEFAULT nextval('public.order_status_order_status_id_seq'::regclass);


--
-- TOC entry 4946 (class 2604 OID 25309)
-- Name: payment_method payment_method_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_method ALTER COLUMN payment_method_id SET DEFAULT nextval('public.payment_method_payment_method_id_seq'::regclass);


--
-- TOC entry 4947 (class 2604 OID 25310)
-- Name: product_status product_status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_status ALTER COLUMN product_status_id SET DEFAULT nextval('public.product_status_product_status_id_seq'::regclass);


--
-- TOC entry 4948 (class 2604 OID 25311)
-- Name: provider provider_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider ALTER COLUMN provider_id SET DEFAULT nextval('public.provider_provider_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 25312)
-- Name: rank rank_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rank ALTER COLUMN rank_id SET DEFAULT nextval('public.rank_rank_id_seq'::regclass);


--
-- TOC entry 4950 (class 2604 OID 25313)
-- Name: review review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review ALTER COLUMN review_id SET DEFAULT nextval('public.review_review_id_seq'::regclass);


--
-- TOC entry 4951 (class 2604 OID 25314)
-- Name: role role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN role_id SET DEFAULT nextval('public.role_role_id_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 25315)
-- Name: sale sale_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale ALTER COLUMN sale_id SET DEFAULT nextval('public.sale_sale_id_seq'::regclass);


--
-- TOC entry 4953 (class 2604 OID 25316)
-- Name: sale_status sale_status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_status ALTER COLUMN sale_status_id SET DEFAULT nextval('public.sale_status_sale_status_id_seq'::regclass);


--
-- TOC entry 4954 (class 2604 OID 25317)
-- Name: sale_type sale_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_type ALTER COLUMN sale_type_id SET DEFAULT nextval('public.sale_type_sale_type_id_seq'::regclass);


--
-- TOC entry 4955 (class 2604 OID 25318)
-- Name: shipping_method shipping_method_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_method ALTER COLUMN shipping_method_id SET DEFAULT nextval('public.shipping_method_shipping_method_id_seq'::regclass);


--
-- TOC entry 4956 (class 2604 OID 25319)
-- Name: size size_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.size ALTER COLUMN size_id SET DEFAULT nextval('public.size_size_id_seq'::regclass);


--
-- TOC entry 4957 (class 2604 OID 25320)
-- Name: stock stock_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock ALTER COLUMN stock_id SET DEFAULT nextval('public.stock_stock_id_seq'::regclass);


--
-- TOC entry 4958 (class 2604 OID 25321)
-- Name: topic topic_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topic ALTER COLUMN topic_id SET DEFAULT nextval('public.topic_topic_id_seq'::regclass);


--
-- TOC entry 4959 (class 2604 OID 25322)
-- Name: transaction transaction_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction ALTER COLUMN transaction_id SET DEFAULT nextval('public.transaction_transaction_id_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 25323)
-- Name: transaction_type transaction_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_type ALTER COLUMN transaction_type_id SET DEFAULT nextval('public.transaction_type_transaction_type_id_seq'::regclass);


--
-- TOC entry 4961 (class 2604 OID 25324)
-- Name: variation variation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variation ALTER COLUMN variation_id SET DEFAULT nextval('public.variation_variation_id_seq'::regclass);


--
-- TOC entry 4962 (class 2604 OID 25325)
-- Name: variation_single variation_single_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variation_single ALTER COLUMN variation_single_id SET DEFAULT nextval('public.variation_single_variation_single_id_seq'::regclass);


--
-- TOC entry 5239 (class 0 OID 25064)
-- Dependencies: 217
-- Data for Name: brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (3, 'EPOQUE', 'Your past, your future, your EPOQUE', 'https://i.ibb.co/qFjxMWk4/image.png', 'epoque.com', '2025-02-18 08:41:37.233+07', '2025-02-18 09:02:51.433+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (10, 'Icefield Messenger', 'He giveth, yet asketh for nothing in return', 'https://i.ibb.co/s9pNKvQv/Icefield-Messenger.png', 'icefieldmessenger.com', '2025-02-18 08:46:03.945+07', '2025-02-18 09:05:53.183+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (9, 'Ambience Synesthesia', 'Heart with the rhythm, give it up to the rock', 'https://i.ibb.co/Hf8W31Hj/Ambience-Synesthesia.png', 'ambiencesynesthesia.com', '2025-02-18 08:45:22.981+07', '2025-02-18 09:06:03.344+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (8, 'MARTHE', 'Go all out', 'https://i.ibb.co/BV08xHG2/MARTHE.png', 'marthe.com', '2025-02-18 08:44:44.359+07', '2025-02-18 09:06:11.592+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (7, 'Dreambind Castle', 'Your terrorbound slumber. Face your fears', 'https://i.ibb.co/RTgKxvM2/Dreambind-Castle.png', 'dreambind.com', '2025-02-18 08:44:11.649+07', '2025-02-18 09:06:18.984+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (6, 'Crossover', 'Together we stand', 'https://i.ibb.co/r2Drrc4C/Crossover.png', 'crossover.com', '2025-02-18 08:43:34.346+07', '2025-02-18 09:06:29.152+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (5, 'Cambrian Series', 'Do not fear the cold', 'https://i.ibb.co/C3f6Pkk6/Cambrian-Series.png', 'cambrian.com', '2025-02-18 08:42:56.748+07', '2025-02-18 09:06:38.215+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (4, 'Test Collection', 'Always unique', 'https://i.ibb.co/53XG3cR/Test-Collection.png', 'testcollection.com', '2025-02-18 08:42:17.95+07', '2025-02-18 09:07:13.816+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (12, 'Made by 0011', 'Established Year 0011', 'https://i.ibb.co/Tx2vXXJR/0011.png', '0011.com', '2025-02-20 13:41:05.9195+07', '2025-02-20 13:41:05.9195+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (14, 'Coral Coast', 'Show your true self!', 'https://i.ibb.co/TqKFZ6JQ/coral-coast.png', 'coralcoast.com', '2025-02-20 13:42:11.968423+07', '2025-02-20 13:42:11.968423+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (17, 'Raythean Pioneer', 'Pioneer, explore the unknown', 'https://i.ibb.co/GvzgjFjN/pioneer.png', 'raythean.pioneer.com', '2025-02-20 13:44:25.314183+07', '2025-02-20 13:44:25.314183+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (18, 'Raythean Striker', 'Striker, valiantly step forward.', 'https://i.ibb.co/tp2vw8gn/striker.png', 'raythean.striker.com', '2025-02-20 13:44:56.664802+07', '2025-02-20 13:44:56.664802+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (19, 'Bloodline of Combat', 'Through the bloodline, the struggle continues.', 'https://i.ibb.co/Gv48TrRp/bloodline-of-combat.png', 'bloodlineofcombat.com', '2025-02-20 13:45:49.262303+07', '2025-02-20 13:45:49.262303+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (21, 'Whistlewind', 'Cheers for racing!!!', 'https://i.ibb.co/zWSwnrVM/whistlewind.png', 'whistlewind.com', '2025-02-20 13:46:47.441493+07', '2025-02-20 13:46:47.441493+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (22, 'Shining Steps', 'Step up, all eyes on you!', 'https://i.ibb.co/gbS2rcFG/shining-steps.png', 'shiningsteps.com', '2025-02-20 13:47:10.467595+07', '2025-02-20 13:47:10.467595+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (23, 'Achievement Star', 'Press Start', 'https://i.ibb.co/wTz6b4w/achievement-star.png', 'achievementstar.com', '2025-02-20 13:48:20.305975+07', '2025-02-20 13:48:20.305975+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (24, '0011/Yun', '意韵不绝', 'https://i.ibb.co/XZSwnczh/0011-yun.png', '0011yun.com', '2025-02-20 13:48:44.790702+07', '2025-02-20 13:48:44.790702+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (13, '0011/Tempest', 'New Year, New Trends', 'https://i.ibb.co/Dm4tBfm/0011-tempest.png', '0011tempest.com', '2025-02-20 13:41:43.702537+07', '2025-02-20 13:48:55.842851+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (15, 'Witch Feast', 'The night approaches, and the Witch''s Feast is nigh', 'https://i.ibb.co/rRVwKXNL/witch-feast.png', 'witchfeast.com', '2025-02-20 13:42:37.907323+07', '2025-02-20 13:49:01.519389+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (16, 'Vitafield', 'Life, Unbound', 'https://i.ibb.co/dstCb4p2/vitafield.png', 'vitafield.com', '2025-02-20 13:43:04.484339+07', '2025-02-20 13:49:06.709777+07') ON CONFLICT DO NOTHING;
INSERT INTO public.brand (brand_id, brand_name, brand_description, brand_image_url, brand_website_url, brand_created_at, brand_updated_at) VALUES (20, 'Rhodes Kitchen', 'Fine clothes, fine flavors, and a fine future', 'https://i.ibb.co/N63dwHrc/rhodes-kitchen.png', 'rhodeskitchen.com', '2025-02-20 13:46:16.254175+07', '2025-02-20 13:49:12.786518+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5241 (class 0 OID 25070)
-- Dependencies: 219
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cart (user_id, variation_id, cart_quantity) VALUES ('e808411f-cdd3-4991-bb13-a768fed10bca', 5, 1) ON CONFLICT DO NOTHING;


--
-- TOC entry 5242 (class 0 OID 25075)
-- Dependencies: 220
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.category (category_id, category_name, category_description, category_image_url, category_created_at, category_updated_at) VALUES (1, 'Casual Outfits', 'Comfort. Occasional. Stylish', 'https://i.ibb.co/TDx4hhMd/images.png', '2025-02-18 08:59:07.274+07', '2025-02-18 08:59:07.274+07') ON CONFLICT DO NOTHING;
INSERT INTO public.category (category_id, category_name, category_description, category_image_url, category_created_at, category_updated_at) VALUES (4, 'Work Outfits', 'Professional. Appropriate. Polished.', 'https://i.ibb.co/fGDpPMQv/image-2025-02-20-135108041.png', '2025-02-20 13:55:03.090104+07', '2025-02-20 13:55:03.090104+07') ON CONFLICT DO NOTHING;
INSERT INTO public.category (category_id, category_name, category_description, category_image_url, category_created_at, category_updated_at) VALUES (3, 'Stage Outfits', 'Theatrical. Vibrant. Breathtaking.', 'https://i.ibb.co/Css1Xdnz/image-2025-02-20-135657430.png', '2025-02-18 14:58:44.727+07', '2025-02-20 13:57:42.247766+07') ON CONFLICT DO NOTHING;
INSERT INTO public.category (category_id, category_name, category_description, category_image_url, category_created_at, category_updated_at) VALUES (2, 'Performance Outfits', 'Striking. Dynamic. Sensational.', 'https://i.ibb.co/GQGs9MLN/fashion-show-logo-silhouette-images-free-vector.jpg', '2025-02-18 09:15:35.313+07', '2025-02-20 13:58:18.602438+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5244 (class 0 OID 25081)
-- Dependencies: 222
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.chat (chat_id, user_id, chat_created_at) VALUES (1, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', '2025-03-10 15:58:52.657+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5246 (class 0 OID 25087)
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
-- TOC entry 5250 (class 0 OID 25099)
-- Dependencies: 228
-- Data for Name: comment_parent; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5251 (class 0 OID 25102)
-- Dependencies: 229
-- Data for Name: discount; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5253 (class 0 OID 25108)
-- Dependencies: 231
-- Data for Name: discount_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.discount_status (discount_status_id, discount_status_name) VALUES (1, 'INACTIVE') ON CONFLICT DO NOTHING;
INSERT INTO public.discount_status (discount_status_id, discount_status_name) VALUES (2, 'ACTIVE') ON CONFLICT DO NOTHING;
INSERT INTO public.discount_status (discount_status_id, discount_status_name) VALUES (3, 'EXPIRED') ON CONFLICT DO NOTHING;


--
-- TOC entry 5255 (class 0 OID 25114)
-- Dependencies: 233
-- Data for Name: discount_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.discount_type (discount_type_id, discount_type_name) VALUES (1, 'PERCENTAGE') ON CONFLICT DO NOTHING;
INSERT INTO public.discount_type (discount_type_id, discount_type_name) VALUES (2, 'FIXED AMOUNT') ON CONFLICT DO NOTHING;


--
-- TOC entry 5257 (class 0 OID 25120)
-- Dependencies: 235
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5259 (class 0 OID 25126)
-- Dependencies: 237
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5261 (class 0 OID 25132)
-- Dependencies: 239
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.notification (notification_id, user_id_sender, notification_title, notification_content, is_notification_draft, notification_created_at, notification_updated_at) VALUES (1, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 'Hey you', 'Try buying something.', false, '2025-03-03 11:32:22.659562+07', '2025-03-03 11:32:22.659562+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5263 (class 0 OID 25138)
-- Dependencies: 241
-- Data for Name: notification_user; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5264 (class 0 OID 25143)
-- Dependencies: 242
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."order" (order_id, user_id, order_status_id, payment_method_id, shipping_method_id, discount_id, incharge_employee_id, order_date, order_total_amount, order_tracking_number, order_note, order_billing_address, order_expected_delivery_date, order_transaction_reference, order_tax, order_created_at, order_updated_at) VALUES ('d9401e1b-9061-4dc6-88ea-60cbabe1a04d', '506ac7fd-3b2a-4c72-b105-5338898fda5d', 3, 1, 1, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', '2025-03-04 09:40:54.924227+07', 2120000.00, 'TNB93LTRUA', 'NO', '1135-0303, Hạp Lĩnh, Bắc Ninh, Bắc Ninh', '2025-03-10 11:35:55.657+07', '6555657', 0.05, '2025-03-03 11:35:55.660764+07', '2025-03-10 11:03:07.383507+07') ON CONFLICT DO NOTHING;
INSERT INTO public."order" (order_id, user_id, order_status_id, payment_method_id, shipping_method_id, discount_id, incharge_employee_id, order_date, order_total_amount, order_tracking_number, order_note, order_billing_address, order_expected_delivery_date, order_transaction_reference, order_tax, order_created_at, order_updated_at) VALUES ('562bf6be-9676-42e5-9e39-fe3354199aa6', 'e808411f-cdd3-4991-bb13-a768fed10bca', 3, 4, 2, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', '2025-03-04 09:40:54.924227+07', 2120000.00, 'TNKB3V0PQX', '1', '1, Hoà Long, Bà Rịa, Bà Rịa - Vũng Tàu', '2025-03-29 09:40:54.924+07', '6054924', 0.05, '2025-03-04 09:40:54.928777+07', '2025-03-12 10:00:51.851836+07') ON CONFLICT DO NOTHING;
INSERT INTO public."order" (order_id, user_id, order_status_id, payment_method_id, shipping_method_id, discount_id, incharge_employee_id, order_date, order_total_amount, order_tracking_number, order_note, order_billing_address, order_expected_delivery_date, order_transaction_reference, order_tax, order_created_at, order_updated_at) VALUES ('ea642ab1-ac1e-4916-a099-44b672142e46', 'e808411f-cdd3-4991-bb13-a768fed10bca', 3, 4, 1, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', '2025-03-04 09:27:17.917375+07', 2120000.00, 'TNRBKMWKIN', '1', '1, An Phú, An Phú, An Giang', '2025-03-11 09:27:17.917+07', '5237917', 0.05, '2025-03-04 09:27:17.920386+07', '2025-03-12 10:04:22.654084+07') ON CONFLICT DO NOTHING;
INSERT INTO public."order" (order_id, user_id, order_status_id, payment_method_id, shipping_method_id, discount_id, incharge_employee_id, order_date, order_total_amount, order_tracking_number, order_note, order_billing_address, order_expected_delivery_date, order_transaction_reference, order_tax, order_created_at, order_updated_at) VALUES ('457415ac-41e4-4f9c-82e0-49ca9a1284d9', 'e808411f-cdd3-4991-bb13-a768fed10bca', 3, 4, 1, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', '2025-03-04 09:31:22.72116+07', 2120000.00, 'TNBLV3CLGD', 'no', '2, Khánh An, An Phú, An Giang', '2025-03-11 09:31:22.721+07', '5482722', 0.05, '2025-03-04 09:31:22.726368+07', '2025-03-12 10:02:57.842195+07') ON CONFLICT DO NOTHING;
INSERT INTO public."order" (order_id, user_id, order_status_id, payment_method_id, shipping_method_id, discount_id, incharge_employee_id, order_date, order_total_amount, order_tracking_number, order_note, order_billing_address, order_expected_delivery_date, order_transaction_reference, order_tax, order_created_at, order_updated_at) VALUES ('9d3675da-d4e2-4fe0-a92b-9be1b6f8d2d9', 'e808411f-cdd3-4991-bb13-a768fed10bca', 3, 4, 2, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', '2025-03-04 09:42:07.970899+07', 1820000.00, 'TN4ZYJRFNK', '', '1, Tân Hưng, Bà Rịa, Bà Rịa - Vũng Tàu', '2025-03-29 09:42:07.97+07', '6127970', 0.05, '2025-03-04 09:42:07.974899+07', '2025-03-12 09:58:37.490348+07') ON CONFLICT DO NOTHING;
INSERT INTO public."order" (order_id, user_id, order_status_id, payment_method_id, shipping_method_id, discount_id, incharge_employee_id, order_date, order_total_amount, order_tracking_number, order_note, order_billing_address, order_expected_delivery_date, order_transaction_reference, order_tax, order_created_at, order_updated_at) VALUES ('426a2f02-5143-41d1-8b64-fae74f53b71c', 'e808411f-cdd3-4991-bb13-a768fed10bca', 3, 4, 2, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', '2025-03-04 09:43:32.064644+07', 1820000.00, 'TNI43OM6IV', '', '`1, Hoà Long, Bà Rịa, Bà Rịa - Vũng Tàu', '2025-03-29 09:43:32.064+07', '6212064', 0.05, '2025-03-04 09:43:32.065646+07', '2025-03-12 09:57:48.871131+07') ON CONFLICT DO NOTHING;
INSERT INTO public."order" (order_id, user_id, order_status_id, payment_method_id, shipping_method_id, discount_id, incharge_employee_id, order_date, order_total_amount, order_tracking_number, order_note, order_billing_address, order_expected_delivery_date, order_transaction_reference, order_tax, order_created_at, order_updated_at) VALUES ('322cb3d1-0aea-4c3c-a495-774c4caa0fd0', 'e808411f-cdd3-4991-bb13-a768fed10bca', 9, 4, 1, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', '2025-03-04 09:08:21.205884+07', 2120000.00, 'TNQ1H4XKE7', 'NO', '113, Đông Thành, Bình Minh, Vĩnh Long', '2025-03-11 09:08:21.206+07', '4101206', 0.05, '2025-03-04 09:08:21.212042+07', '2025-03-12 10:15:20.522335+07') ON CONFLICT DO NOTHING;
INSERT INTO public."order" (order_id, user_id, order_status_id, payment_method_id, shipping_method_id, discount_id, incharge_employee_id, order_date, order_total_amount, order_tracking_number, order_note, order_billing_address, order_expected_delivery_date, order_transaction_reference, order_tax, order_created_at, order_updated_at) VALUES ('e7a8b1b4-271d-46cc-8e31-4144cdc9e365', 'e808411f-cdd3-4991-bb13-a768fed10bca', 9, 4, 1, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', '2025-03-04 09:44:30.650629+07', 1820000.00, 'TN3MSLA8GK', '', 'a, An Phú, An Phú, An Giang', '2025-03-11 09:44:30.65+07', '6270650', 0.05, '2025-03-04 09:44:30.651135+07', '2025-03-12 10:23:23.362628+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5265 (class 0 OID 25148)
-- Dependencies: 243
-- Data for Name: order_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (1, 'PENDING') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (2, 'PROCESSING') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (5, 'CANCELLED') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (6, 'RETURNED') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (3, 'SHIPPING') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (4, 'COMPLETED') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (7, 'DENIED') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (8, 'INSPECTION') ON CONFLICT DO NOTHING;
INSERT INTO public.order_status (order_status_id, order_status_name) VALUES (9, 'RETURNING') ON CONFLICT DO NOTHING;


--
-- TOC entry 5267 (class 0 OID 25154)
-- Dependencies: 245
-- Data for Name: order_variation_single; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('d9401e1b-9061-4dc6-88ea-60cbabe1a04d', 1, NULL, 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('322cb3d1-0aea-4c3c-a495-774c4caa0fd0', 2, NULL, 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('ea642ab1-ac1e-4916-a099-44b672142e46', 3, NULL, 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('457415ac-41e4-4f9c-82e0-49ca9a1284d9', 4, NULL, 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('562bf6be-9676-42e5-9e39-fe3354199aa6', 5, NULL, 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('9d3675da-d4e2-4fe0-a92b-9be1b6f8d2d9', 6, NULL, 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('426a2f02-5143-41d1-8b64-fae74f53b71c', 7, NULL, 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.order_variation_single (order_id, variation_single_id, sale_id, variation_price_at_purchase) VALUES ('e7a8b1b4-271d-46cc-8e31-4144cdc9e365', 8, NULL, 1800000.00) ON CONFLICT DO NOTHING;


--
-- TOC entry 5268 (class 0 OID 25159)
-- Dependencies: 246
-- Data for Name: payment_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.payment_method (payment_method_id, payment_method_name) VALUES (1, 'COD') ON CONFLICT DO NOTHING;
INSERT INTO public.payment_method (payment_method_id, payment_method_name) VALUES (2, 'VNPAY') ON CONFLICT DO NOTHING;
INSERT INTO public.payment_method (payment_method_id, payment_method_name) VALUES (3, 'PAYOS') ON CONFLICT DO NOTHING;
INSERT INTO public.payment_method (payment_method_id, payment_method_name) VALUES (4, 'TRANSFER') ON CONFLICT DO NOTHING;


--
-- TOC entry 5270 (class 0 OID 25165)
-- Dependencies: 248
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('ea6bf5c2-2521-40de-b0f3-ae5ac79aad88', 8, 2, 'Wiping Knife', 'WIP453', 'One of Cutter''s casual outfits.

在众多光碟收藏中，刻刀最终选择了厨房教学系列。好好学习，争取下次不会再被禁止进入厨房！

MARTHE Sports Line New Arrivals/Wiping Knife. 青少年群体中流行的款式。贴身透气，设计前卫，以高对比配色和可自由拆卸的搭扣组合为卖点，助力客户肆意挥洒个性。
', '2025-03-03 11:02:10.969145+07', '2025-03-03 11:02:10.969145+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('7cf34ddf-8e22-4202-ac64-c8f2f0a363b3', 15, 2, 'Mirror Visitor', 'MIR493', 'One of Iris''s stage outfits.
The children absolutely love this costume of Iris''s, and to placate them, she might even show up to her recent storytelling tea parties wearing it.
Witch Feast Role-Playing Script "The Curious Trove Manor" Custom Line/Mirror Visitor. The actor–hush, now. Does she play the role of the Master, a guest, or a phantom in the mirror? Until the highest landing is reached, all remains a mystery.', '2025-03-03 11:07:28.931304+07', '2025-03-03 11:07:28.931304+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('7cdb8189-83e2-46de-acf8-e2b8dfbe36b5', 5, 2, 'Winter Messenger', 'WIN047', 'One of Texas''s casual outfits.
Life is all about doing whatever you want.
Cambrian 1096 Winter New Arrivals/Winter Messenger. Comfortable and close-fitting with handmade details, it provides complete protection by applying durable and warm fabric that is both waterproof and windproof, making it the best choice for daily occasions.', '2025-03-03 11:09:34.286745+07', '2025-03-03 11:09:34.286745+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('acd17d1f-9189-412e-a427-8de5af01f3e4', 4, 3, 'Bunch of Sunlight', 'BUN350', 'One of Lava''s casual outfits.
May you always look toward the bright future as these flowers do.
Test Collection Series/Bunch of Sunlight. Outfit specially designed for going out. It uses the operator''s main color as basic tone and matches it with a different-colored jacket for a vivid contrast.', '2025-03-03 10:42:37.185443+07', '2025-03-03 10:42:37.185443+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('4d7bcbf9-a8dc-4410-b226-ac3d84d3badb', 3, 3, 'Il Segreto della Notte', 'ILS348', 'One of Texas the Omertosa''s casual outfits.
又是一年狂欢节，德克萨斯只是想好好休息一下，但恼人的老板藏在每个气球里催促她干活，没办法，她只能见一个踩一个。
EPOQUE Collection New Arrivals/Il Segreto della Notte. 修身合体的定制衣装加以考究配饰，既能彰显身份，又不显得夺人眼球。随衣附赠狂欢节贵宾请帖，以及大量气球。', '2025-03-03 10:50:39.685461+07', '2025-03-03 10:50:39.685461+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('2a70582d-24e9-49a5-9759-1fef33b69030', 12, 3, 'Spring Feast', 'SPR446', 'One of Shu''s casual outfits.
她总是第一个到。她总是默默收拾一切。她总是最后一个走。
0011 New Arrivals/Spring Feast. 黍与兄弟姐妹们举办宴会时的装扮。锦绣紫衫，轻纱罗裙，神女卧于此间，静看沧海桑田。', '2025-03-03 10:53:25.579782+07', '2025-03-03 10:53:25.579782+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('8521ff88-62d8-48cb-9315-27d3dbf103e3', 15, 3, 'Priory of Abyss', 'PRI593', 'One of Whisperain''s stage outfits.
Everyone unanimously agreed that Whisperain''s character card was scarily well put together, and she herself looks shockingly fitting... Is this really her first time playing this game?
Witch Feast Role-Playing Script "Dominions & Dogma" Custom Line/Priory of Abyss. This player shall be the sister in black, who has saved countless adventurers'' lives. The people never ask who forgets the traumas of their mundane lives for them.', '2025-03-03 11:05:09.274716+07', '2025-03-03 11:05:09.274716+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('8e426e33-971b-4544-8837-d2dbae591781', 5, 3, 'Undercurrent', 'UND064', 'One of Specter''s casual outfits.
She cares a lot about this outfit, even though she already can''t remember why.
Cambrian 1096 Winter New Arrivals/Undercurrent. Comfortable and close-fitting with handmade details, it applies multiple layers of durable, light and warm fabric, making it the best choice for daily occasions.', '2025-03-03 11:08:42.165695+07', '2025-03-03 11:08:42.165695+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('49cb8a36-f93a-4bf7-ac1a-21156e5a5d78', 8, 3, 'Ready to Go', 'REA918', 'One of Zima''s casual outfits.
The right temperament and clothing converge in just the perfect manner.
MARTHE New Arrivals/Ready to Go. Inspired by traditional Ursus school uniforms, this season''s most successful iteration is fine-tuned to capture the trends of today''s youth. Top seller in Ursus.', '2025-03-03 11:03:25.10644+07', '2025-03-06 15:20:42.93168+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('f89b468d-7488-4881-8f5a-5ad24d46ec00', 10, 2, 'Hope Cruise', 'HOP800', 'One of Leonhardt''s casual outfits.
On this day, the news he brings has nothing to do with Catastrophes. He carries only happiness and hope, and the gifts everyone dreamed of.
Leonhardt''s winter outfit/Hope Cruise. Made in Victorian fashion, featuring exquisite materials. Perfectly aligned while maintaining comfort to give an overall crisp look to the outfit – simple, yet not so simple.', '2025-03-03 11:10:47.62996+07', '2025-03-03 11:10:47.62996+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('76af1947-fa47-43c6-bd00-3fdf4c37e5c2', 7, 2, 'Exterminator in the Square', 'EXT811', 'One of Glaucus''s at-play costumes.
The rider seeks to find the castle''s entrances—
Multimedia Escape Experience "Dreambind Castle" Visitor''s Prepared Outfit/Exterminator in the Square. The outfit Glaucus wore for the photoshoot event "Cyclonic Square." Prior to the photographer clicking the shutter, Glaucus needed to nail down her pose.', '2025-03-03 11:21:40.838667+07', '2025-03-03 11:21:40.838667+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('946104c2-0641-465d-a2d2-1f2cfd724ac5', 22, 2, 'Frlibe on the Palace', 'FRL165', 'One of Astesia''s stage outfits.
Humility is left to the audience, pride belongs to the singer. This night, only I shine.
Monster Siren Records Idol Project "Shining Steps" Promotional Costume/Frilbe on the Palace. Astesia joins the project at her own expense, looking to interpret the stories written in the sky in a popular and easily accessible way.', '2025-03-03 11:25:23.256125+07', '2025-03-03 11:25:23.256125+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('4dc195b3-49aa-42c3-b521-fa5f91087068', 6, 2, 'Exhibition', 'EXH769', 'Rainbow Six collab outfit.
Time is the roadside exhibit. Visitors walk toward the exit, connected to the future.
Rainbow Six Collaborative Series/Exhibition. Picked by Doc based on practical requirements, offering protection against wind, dust, and cold as he goes to the next place that needs him. Of that, there is never a shortage.', '2025-03-03 11:30:10.753729+07', '2025-03-03 11:30:10.753729+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('6c94d08d-ba81-461f-9d1c-aab6d40f3bc7', 10, 2, 'Untold Stories', 'UNT912', 'One of Erato''s casual outfits.
The story goes from day to night and back, but not all stories are meant to be told right away. Hot drinks and beautiful scenery are everything tonight. A poem yet unread can wait for tomorrow.
Erato''s home attire/Untold Stories. Soft, tight-fitting fabric with a thick and comfy scarf; comfortable attire for relaxing at home.', '2025-03-03 11:11:31.646328+07', '2025-03-03 11:11:31.646328+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('249b0d45-19ab-4380-a639-dfb29d72c499', 16, 2, 'Campfire Cooking Smoke', 'CAM956', 'One of Mousse''s casual outfits.
Where are you? Are you doing well? Can we picnic together again?
Vitafield [Camper] Series Classics/Campfire Cooking Smoke. Warm fur coat paired with red woven scarf for an inviting sight.', '2025-03-03 11:12:50.673277+07', '2025-03-03 11:12:50.673277+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('e9b10e5f-dfd8-47e4-ac38-e47799ecbc6c', 16, 2, 'Finder in the Rough', 'FIN618', 'One of Leonhardt''s special work outfits.
As the wasteland wanderers say: when you find what you need to survive, you''ve found treasure.
Vitafield [Foruiner] Series Classics/Finder in the Rough. For the explorer pursuing what remains. Made with special materials suited for adapting to all climates, meeting the harsh demands of complex environments.', '2025-03-03 11:13:56.971922+07', '2025-03-03 11:13:56.971922+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('8cadf0aa-205c-4e60-a0cf-0ddcb4a456e4', 18, 2, 'Skyline', 'SKY974', 'One part of Schwarz''s tactical equipment.
Schwarz knows there''s a little blue being who''ll follow her. Schwarz has always known.
Striker Series/Skyline. A product of Raythean Industries, geared for hypothetical city combat environs. Along with basic protection, the application of the latest in reflective paint allows specialist personnel to blend into the complex surroundings of the city.', '2025-03-03 11:15:23.214839+07', '2025-03-03 11:15:23.214839+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('0a30912c-2ca7-4bc4-8c55-328dfa5e8d93', 18, 2, 'Dawnbreak', 'DAW830', 'One of Coldshot''s casual outfits.
A sudden burst of daylight, and she dances with the dust.
Striker Series/Dawnbreak. A product of Raythean Industries, made for mechanized combat, combining fashionable colors with punk style. Multi-purpose bandoliers ensure efficiency even in complex environments, providing absolute freedom.', '2025-03-03 11:16:21.04125+07', '2025-03-03 11:16:21.04125+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('68ec989f-b9b0-411f-84a2-d73894477ce2', 20, 2, 'Seven in the Morning', 'SEV711', 'One of Croissant''s casual outfits.
Croissants are obviously delicious!
Rhodes Kitchen Collection/Seven in the Morning. Designed by Croissant. Actually just recycled Exusiai''s design because it''s cheaper to do it that way.', '2025-03-03 11:19:31.70122+07', '2025-03-03 11:19:31.70122+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('5b4d8a68-7ce5-43cb-9b1c-a19395cc0e9d', 7, 2, 'Dream Within a Dreammare', 'DRE919', 'One of Phantom''s working costumes.
"Pristine dreamscapes twine over the tangible in symbiosis, their fear and dread a permeation just begun. You outsiders, honored to take them on, are the first to do so—that live."
Multimedia Escape Experience "Dreambind Castle" Visitor''s Prepared Outfit/Dream Within a Dreammare. Clothes of Phantom''s, the attire he sported while staffing the "Dreambind Castle" event. The dance as cloth, the song as silk, the threading through emotion, the tailoring by fabrication, the weave of obliteration and howling madness, it all culminates in this majestic yet skin-crawling ensemble.', '2025-03-03 11:21:08.694184+07', '2025-03-03 11:21:08.694184+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('f361f9d5-a207-4322-802e-3c59d9dcbd7a', 21, 2, 'Queen No. 1', 'QUE452', 'One of Bagpipe''s work outfits.
But the racers were scared of Bagpipe, because on the off-chance of a crash, they''d be the only ones injured. Luckily, that was another reason the organizers asked her to be the flag-bearer.
Whistlewind Series Race Queen Core Line. In full race queen form, sporting a Raythean-sponsored Piledriver Spear, Bagpipe carries herself tall and brings the spectators'' cheers non-stop.
', '2025-03-03 11:22:24.114078+07', '2025-03-03 11:22:24.114078+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('63b39dde-effe-4519-afae-666ba945e653', 9, 2, 'Golden Dream', 'GOL732', 'One of Lumen''s work outfits.
The golden sunlight is not the only visitor to this room. The ocean has just revealed itself, and Lumen gestures at you to speak softly so as to not disturb the dreamlike scene.
Ambience Synesthesia Tailor-Provided/Golden Dream. Lumen''s casual leisure wear, tailored for elegance from lightweight materials. The sea mist has lifted, and you can now see the lighthouse without binoculars.', '2025-03-03 11:23:13.324447+07', '2025-03-03 11:23:13.324447+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('f946787f-afa1-4e5e-baa3-52c2725f6fa8', 9, 2, 'Obsidian', 'OBS402', 'One of Mudrock''s work outfits.
Most hotheaded troublemakers back off for their own safety, seeing the iron hammer she''s carrying.
Ambience Synesthesia Tailor-Provided/Obsidian. Mudrock''s work outfit. Mudrock made rounds between every facility at the venue, ensuring the performance would go without a hitch. Though working behind the scenes, she nevertheless opted for a disguise of sorts so as not to disturb the audience.', '2025-03-03 11:23:51.114467+07', '2025-03-03 11:23:51.114467+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('d9468861-c7c8-4fd8-865b-a24ebad95ba9', 23, 2, 'Sport For All', 'SPO966', 'One of Flametail''s casual outfits.
Flametail likes playing games, because the rules are reasonable and don''t change at the last minute.
Achievement Star Collection/Sport for All. Sporty outfit worn by Flametail when playing VR games. The limited space is made even more cramped by the gaming equipment, but she has a great time nonetheless.', '2025-03-03 11:26:16.348786+07', '2025-03-03 11:26:16.348786+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('bb29fdd6-90fc-4910-a45b-ef838eda7b07', 23, 2, 'The Archivist and Her Pilgrimage', 'THE244', 'One of Leizi''s cosplay outfits.
《命运追索》开局时，游学者守在荒芜遗迹，接引英雄踏上坎坷的命途。惊蛰怀疑她的动机，解构她的言语，寻遍关于她的秘密，最终开启了终局之后的关卡。
Achievement Star Collection/The Archivist and Her Pilgrimage. 惊蛰受邀参加电玩展时穿的服饰。她扮演的是一位与魔法生物相伴的神秘游学者。社群颂扬她的贡献，故事因她有了真正的解答。', '2025-03-03 11:26:58.112439+07', '2025-03-03 11:26:58.112439+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('86f7b1c9-c96b-45f7-923a-844946d4db2b', 24, 2, 'Among the Clouds', 'AMO473', 'One of Ptilopsis''s casual outfits.
Crescents of jade shine upon the peaks, as white owls soar amidst the pale clouds.
0011 Yun Series New Arrivals/Among the Clouds. Garments crafted by Baizao''s master tailors, embodying Yan''s charms as envisioned by the wearer. Ptilopsis lightly plucks the strings, and heaven and earth resound with a crisp melody.', '2025-03-03 11:28:31.930381+07', '2025-03-03 11:28:31.930381+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('09e7a2f5-f6f7-4704-b63c-5efe028f94ac', 6, 2, 'Liberté//Échec', 'LIB573', 'I.T. collab outfit.
Accomplishing deeds has no need for meaning. Where the mind goes, the body follows.
I.T Brand UNDER GARDEN Collab Outfit/Liberté//Échec. A black and red base. A non-integrated design, with multiple accessories to select, the complete effect taking on personalized preferences.', '2025-03-03 11:30:41.806658+07', '2025-03-03 11:30:41.806658+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('1a24995c-7784-4bfa-aa7e-06d676ad09fd', 13, 3, 'The Fruition', 'THE286', 'One of Shalem''s casual outfits.
The curtains fall, as do ripened fruits. If you wish to taste the fruit, learn to create. They are best fallen, as they have elsewhere, as yours do.
0011 Tempest Series/The Fruition. Classic black and white, with just a touch of color. No need for complex ornamentations; any flair belongs to the performer alone.', '2025-03-03 10:55:16.531933+07', '2025-03-03 10:55:16.531933+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('d687c303-4793-49e8-8d4f-717b034c11ca', 4, 3, 'Solo Around The World', 'SOL659', 'One of Amiya''s birthday outfits.
She draws the bow slowly, gently whispering her wishes. Though not a single note has ever changed, her audience, her stage, and she herself have been constantly evolving. She will not stop playing, until this land and sky hold her music in their memory.
Test Birthday Collection 1101/Solo Around The World. The Ark cradling the cocoon of dreams sailed into the galaxy, dissolving into millions of threads. With love as their needle, the many hands crafted a one-of-a-kind garment for Amiya. The remaining threads, intertwined with wishes, were fashioned into a violin.', '2025-03-03 10:40:58.270432+07', '2025-03-03 10:40:58.270432+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('2432e9cb-3823-4b40-b977-ae5adf7424f7', 3, 3, 'A Thousand Correspondences', 'ATH173', 'One of Heidi''s casual outfits.
Heidi has sent a thousand letters, ranging from her teenage dreams to heartfelt essays, keeping the replies in a box she carries around. She has met some of her recipients, but others she will never hear from again.
EPOQUE Collection New Arrivals/A Thousand Correspondences. A custom outfit made of fine and lightweight material, tailored based on Heidi''s descriptions of her childhood summers. Though it feels different from how she remembers.', '2025-03-03 10:51:24.055914+07', '2025-03-03 10:51:24.055914+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('02ba9ff0-6955-4ee8-8ca7-6516528557f3', 14, 3, 'Holiday HD71', 'HOL121', 'One of Santalla''s summer outfits.

She accepted the melting of the ice. After coming to the south, she takes a moment to relax under the sunlight.

MARTHE [Coral Coast] Holiday Series HD71. Comfortable, relaxed, breathable, and lightweight. Allows you to enjoy a perfect beach experience in absolute relaxation.', '2025-03-03 11:00:51.517888+07', '2025-03-03 11:00:51.517888+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('539b9399-d9a2-49cb-8a79-3037cd885ac1', 12, 3, 'Dusk Wisteria', 'DUS561', 'One of Lava the Purgatory''s casual outfits.
After parting ways with Kroos, Lava prepared several outfits to make it easy for her to traverse the land, and this is one of them.
0011 New Release/Dusk Wisteria. Handmade in Lungmen, tailor-fitted with special consideration to exotic design elements. The outfit has been improved in accordance with the customer''s preference to incorporate Yan''s novel trends', '2025-03-03 10:54:25.045375+07', '2025-03-03 10:54:25.045375+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('c59cc71b-09ef-41be-ae8c-0f45f4e898e6', 13, 3, 'The Road to Here', 'THE335', 'One of Paprika''s casual outfits.
Raindrops drown out footsteps, the crowd comes and goes, and no one notices that she has stopped. It is an unremarkable city, but she remembers how long it took for her to cross the ruins and wastes to set foot here.
0011 Tempest Series/The Road to Here. Loose-fitting coat that can envelop a young girl. The waterproof fabric makes it suitable for a rainy day.', '2025-03-03 10:55:57.196277+07', '2025-03-03 10:55:57.196277+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('fa869e27-0928-49f6-aa2c-ca5d816e579c', 14, 3, 'Holiday HD49', 'HOL569', 'One of Ceylon''s summer outfits.
She wishes she could share the taste of these cherries and citrus tea with the one on her mind, now far away.
MARTHE [Coral Coast] Casual Vacation Series HD49. Comfortable, relaxed, breathable, and lightweight. Allows you to enjoy a perfect beach experience in absolute relaxation.', '2025-03-03 11:00:02.594827+07', '2025-03-03 11:00:02.594827+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('b5006db6-1120-48d1-aa1c-c7a28618f605', 19, 3, 'Ten Thousand Mountains', 'TEN270', 'One of Ch''en the Holungday''s outfits for crucial moments.
"My thanks to you two Tianshi for accompanying me on my journey so far, but it''s about time we went our separate ways."
Bloodline of Combat Collection/Ten Thousand Mountains. Ch''en Hui-chieh entered the capital on a starry night, and left before sunrise after settling matters. She bid farewell to old friends and took a sampan down the river, the lamp on the prow crashing through the fog and night.', '2025-03-03 11:17:17.722463+07', '2025-03-06 15:20:42.932665+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('5da2b1a7-18fb-4c9d-923b-100158163c14', 19, 3, 'Eine Variation', 'EIN677', 'One of Ebenholz''s outfits for crucial moments.
"My duty, my obligation, the shame of my nobility, and the golden cage that I oh so hate... this is my path."
Bloodline of Combat Collection/Eine Variation. A traditional-style gown worn by every Graf Urtica, now draped over Ebenholz''s shoulders. Orders apathetically seep from the tip of the staff, piercing through the sparse ensemble of nobles.', '2025-03-03 11:18:18.108923+07', '2025-03-06 15:20:42.932665+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('b0047023-66ef-467a-a7af-f739f94aecd9', 20, 3, 'Bibliosmia', 'BIB577', 'One of Istina''s casual outfits.
The most fun in life is had in books and through food.
Rhodes Kitchen Collection/Bibliosmia. After being re-coordinated to reflect the national outfits of the people of Ursus, Istina wore this outfit to promote traditional cuisine at the food festival. Underneath the plain materials are countless intricate details, and only those who deem themselves wise come to seek answers.', '2025-03-03 11:20:10.121984+07', '2025-03-06 15:20:42.933171+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('28ca3933-a272-4f36-84d4-fc280c5cf984', 22, 3, 'Dreaming High', 'DRE621', 'One of Ray''s performance outfits.
莱伊不是很明白什么叫做“舞台布置”，在咨询了兰娜和小锅盖之后，她决定用矿场里的挖掘机来做那个名为“视觉主体”的东西。
Monster Siren Records Idol Project "Shining Steps" Promotional Costume/Dreaming High. 为了赢得雷姆必拓地区海选奖品单上的特别奖品高级沙地兽兽粮，莱伊觉得偶尔挑战一下新领域也不错。', '2025-03-03 11:24:51.091223+07', '2025-03-06 15:20:42.933171+07') ON CONFLICT DO NOTHING;
INSERT INTO public.product (product_id, brand_id, product_status_id, product_name, product_code, product_description, product_created_at, product_updated_at) VALUES ('39c87bec-88d6-44a0-8bda-67efb1fc8065', 24, 3, 'Clouds Float Like Ideas of Art', 'CLO612', 'One of Lunacub''s casual outfits.
"I had a drea, Agnese... I turned into a winged beastling amongst flowers, flying over a strange fence, up into the sky... Will there be people up above the clouds to hunt with us?"
0011 Yun Series/Clouds Float Like Ideas of Art. Presented by the finest Yanese artisans, combining classic style with trendy spirit.', '2025-03-03 11:27:54.976639+07', '2025-03-06 15:20:42.933171+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5271 (class 0 OID 25170)
-- Dependencies: 249
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product_category (product_id, category_id) VALUES ('d687c303-4793-49e8-8d4f-717b034c11ca', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('acd17d1f-9189-412e-a427-8de5af01f3e4', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('4d7bcbf9-a8dc-4410-b226-ac3d84d3badb', 3) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('2432e9cb-3823-4b40-b977-ae5adf7424f7', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('2a70582d-24e9-49a5-9759-1fef33b69030', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('539b9399-d9a2-49cb-8a79-3037cd885ac1', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('1a24995c-7784-4bfa-aa7e-06d676ad09fd', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('c59cc71b-09ef-41be-ae8c-0f45f4e898e6', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('fa869e27-0928-49f6-aa2c-ca5d816e579c', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('02ba9ff0-6955-4ee8-8ca7-6516528557f3', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('ea6bf5c2-2521-40de-b0f3-ae5ac79aad88', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('49cb8a36-f93a-4bf7-ac1a-21156e5a5d78', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('8521ff88-62d8-48cb-9315-27d3dbf103e3', 3) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('7cf34ddf-8e22-4202-ac64-c8f2f0a363b3', 3) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('8e426e33-971b-4544-8837-d2dbae591781', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('7cdb8189-83e2-46de-acf8-e2b8dfbe36b5', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('f89b468d-7488-4881-8f5a-5ad24d46ec00', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('6c94d08d-ba81-461f-9d1c-aab6d40f3bc7', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('249b0d45-19ab-4380-a639-dfb29d72c499', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('e9b10e5f-dfd8-47e4-ac38-e47799ecbc6c', 4) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('8cadf0aa-205c-4e60-a0cf-0ddcb4a456e4', 4) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('0a30912c-2ca7-4bc4-8c55-328dfa5e8d93', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('b5006db6-1120-48d1-aa1c-c7a28618f605', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('5da2b1a7-18fb-4c9d-923b-100158163c14', 2) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('68ec989f-b9b0-411f-84a2-d73894477ce2', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('b0047023-66ef-467a-a7af-f739f94aecd9', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('5b4d8a68-7ce5-43cb-9b1c-a19395cc0e9d', 2) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('76af1947-fa47-43c6-bd00-3fdf4c37e5c2', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('f361f9d5-a207-4322-802e-3c59d9dcbd7a', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('63b39dde-effe-4519-afae-666ba945e653', 3) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('f946787f-afa1-4e5e-baa3-52c2725f6fa8', 3) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('28ca3933-a272-4f36-84d4-fc280c5cf984', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('946104c2-0641-465d-a2d2-1f2cfd724ac5', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('d9468861-c7c8-4fd8-865b-a24ebad95ba9', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('bb29fdd6-90fc-4910-a45b-ef838eda7b07', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('39c87bec-88d6-44a0-8bda-67efb1fc8065', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('86f7b1c9-c96b-45f7-923a-844946d4db2b', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('4dc195b3-49aa-42c3-b521-fa5f91087068', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.product_category (product_id, category_id) VALUES ('09e7a2f5-f6f7-4704-b63c-5efe028f94ac', 1) ON CONFLICT DO NOTHING;


--
-- TOC entry 5272 (class 0 OID 25175)
-- Dependencies: 250
-- Data for Name: product_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product_status (product_status_id, product_status_name) VALUES (1, 'OUT OF STOCK') ON CONFLICT DO NOTHING;
INSERT INTO public.product_status (product_status_id, product_status_name) VALUES (2, 'IMPORTING') ON CONFLICT DO NOTHING;
INSERT INTO public.product_status (product_status_id, product_status_name) VALUES (3, 'AVAILABLE') ON CONFLICT DO NOTHING;
INSERT INTO public.product_status (product_status_id, product_status_name) VALUES (4, 'RUNNING OUT') ON CONFLICT DO NOTHING;
INSERT INTO public.product_status (product_status_id, product_status_name) VALUES (5, 'NEW') ON CONFLICT DO NOTHING;


--
-- TOC entry 5274 (class 0 OID 25181)
-- Dependencies: 252
-- Data for Name: provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.provider (provider_id, provider_name, provider_image_url, provider_email, provider_phone, provider_address, provider_created_at, provider_updated_at) VALUES (1, 'Eldoria', 'https://i.ibb.co/fzCtX6z3/image-2025-02-27-144249132.png', 'eldoria@ae.com', '0123456789', 'Eldoria, Aerithreria', '2025-02-27 14:42:53.725959+07', '2025-02-27 14:42:53.725959+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5276 (class 0 OID 25187)
-- Dependencies: 254
-- Data for Name: rank; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rank (rank_id, rank_name, rank_num, rank_payment_requirement, rank_base_discount) VALUES (1, 'Unranked', 1, 0.00, 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.rank (rank_id, rank_name, rank_num, rank_payment_requirement, rank_base_discount) VALUES (2, 'Bronze', 2, 1000000.00, 0.02) ON CONFLICT DO NOTHING;
INSERT INTO public.rank (rank_id, rank_name, rank_num, rank_payment_requirement, rank_base_discount) VALUES (3, 'Silver', 3, 5000000.00, 0.05) ON CONFLICT DO NOTHING;
INSERT INTO public.rank (rank_id, rank_name, rank_num, rank_payment_requirement, rank_base_discount) VALUES (4, 'Gold', 4, 10000000.00, 0.07) ON CONFLICT DO NOTHING;
INSERT INTO public.rank (rank_id, rank_name, rank_num, rank_payment_requirement, rank_base_discount) VALUES (5, 'Diamond', 5, 30000000.00, 0.10) ON CONFLICT DO NOTHING;



--
-- TOC entry 5280 (class 0 OID 25199)
-- Dependencies: 258
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.role (role_id, role_name) VALUES (1, 'ADMIN') ON CONFLICT DO NOTHING;
INSERT INTO public.role (role_id, role_name) VALUES (2, 'CUSTOMER') ON CONFLICT DO NOTHING;
INSERT INTO public.role (role_id, role_name) VALUES (3, 'STAFF') ON CONFLICT DO NOTHING;


--
-- TOC entry 5282 (class 0 OID 25205)
-- Dependencies: 260
-- Data for Name: sale; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sale (sale_id, sale_type_id, sale_status_id, sale_value, sale_start_date, sale_end_date, sale_created_at, sale_updated_at) VALUES (3, 1, 2, 10.00, '2025-03-11 08:34:00+07', '2025-03-18 08:34:00+07', '2025-03-10 08:34:37.458309+07', '2025-03-10 08:34:40.936593+07') ON CONFLICT DO NOTHING;
INSERT INTO public.sale (sale_id, sale_type_id, sale_status_id, sale_value, sale_start_date, sale_end_date, sale_created_at, sale_updated_at) VALUES (4, 2, 2, 1000000.00, '2025-03-12 14:56:00+07', '2025-04-04 14:56:00+07', '2025-03-11 14:56:56.645947+07', '2025-03-11 14:56:56.645947+07') ON CONFLICT DO NOTHING;
INSERT INTO public.sale (sale_id, sale_type_id, sale_status_id, sale_value, sale_start_date, sale_end_date, sale_created_at, sale_updated_at) VALUES (5, 1, 2, 44.00, '2025-03-12 15:49:00+07', '2025-04-05 15:49:00+07', '2025-03-11 15:49:07.586983+07', '2025-03-11 15:49:07.586983+07') ON CONFLICT DO NOTHING;
INSERT INTO public.sale (sale_id, sale_type_id, sale_status_id, sale_value, sale_start_date, sale_end_date, sale_created_at, sale_updated_at) VALUES (6, 2, 2, 99999999.00, '2025-03-13 15:50:00+07', '2025-04-18 15:50:00+07', '2025-03-11 15:50:36.32139+07', '2025-03-11 15:50:36.32139+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5283 (class 0 OID 25208)
-- Dependencies: 261
-- Data for Name: sale_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sale_product (sale_id, product_id) VALUES (4, 'fa869e27-0928-49f6-aa2c-ca5d816e579c') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (4, '8521ff88-62d8-48cb-9315-27d3dbf103e3') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (4, '539b9399-d9a2-49cb-8a79-3037cd885ac1') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (4, 'c59cc71b-09ef-41be-ae8c-0f45f4e898e6') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (3, '28ca3933-a272-4f36-84d4-fc280c5cf984') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (3, '02ba9ff0-6955-4ee8-8ca7-6516528557f3') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (3, '49cb8a36-f93a-4bf7-ac1a-21156e5a5d78') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (3, 'd687c303-4793-49e8-8d4f-717b034c11ca') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (3, '8e426e33-971b-4544-8837-d2dbae591781') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (3, '39c87bec-88d6-44a0-8bda-67efb1fc8065') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (3, '2432e9cb-3823-4b40-b977-ae5adf7424f7') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (3, 'b5006db6-1120-48d1-aa1c-c7a28618f605') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (5, '4d7bcbf9-a8dc-4410-b226-ac3d84d3badb') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (5, '1a24995c-7784-4bfa-aa7e-06d676ad09fd') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (5, '2a70582d-24e9-49a5-9759-1fef33b69030') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (5, 'b0047023-66ef-467a-a7af-f739f94aecd9') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_product (sale_id, product_id) VALUES (6, '5da2b1a7-18fb-4c9d-923b-100158163c14') ON CONFLICT DO NOTHING;


--
-- TOC entry 5285 (class 0 OID 25214)
-- Dependencies: 263
-- Data for Name: sale_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sale_status (sale_status_id, sale_status_name) VALUES (1, 'INACTIVE') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_status (sale_status_id, sale_status_name) VALUES (2, 'ACTIVE') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_status (sale_status_id, sale_status_name) VALUES (3, 'EXPIRED') ON CONFLICT DO NOTHING;


--
-- TOC entry 5287 (class 0 OID 25220)
-- Dependencies: 265
-- Data for Name: sale_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sale_type (sale_type_id, sale_type_name) VALUES (1, 'PERCENTAGE') ON CONFLICT DO NOTHING;
INSERT INTO public.sale_type (sale_type_id, sale_type_name) VALUES (2, 'FIXED AMOUNT') ON CONFLICT DO NOTHING;


--
-- TOC entry 5289 (class 0 OID 25226)
-- Dependencies: 267
-- Data for Name: shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.shipping_method (shipping_method_id, shipping_method_name) VALUES (1, 'EXPRESS') ON CONFLICT DO NOTHING;
INSERT INTO public.shipping_method (shipping_method_id, shipping_method_name) VALUES (2, 'STANDARD') ON CONFLICT DO NOTHING;


--
-- TOC entry 5291 (class 0 OID 25232)
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
-- TOC entry 5293 (class 0 OID 25238)
-- Dependencies: 271
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.stock (stock_id, stock_name, stock_address) VALUES (2, 'Unleashed VL', 'Bình Minh, Vĩnh Long') ON CONFLICT DO NOTHING;
INSERT INTO public.stock (stock_id, stock_name, stock_address) VALUES (1, 'Unleashed CT', 'Ninh Kiều, Cần Thơ') ON CONFLICT DO NOTHING;
INSERT INTO public.stock (stock_id, stock_name, stock_address) VALUES (3, 'Unleashed ST', 'Sóc Trăng, Sóc Trăng') ON CONFLICT DO NOTHING;
INSERT INTO public.stock (stock_id, stock_name, stock_address) VALUES (4, 'Unleashed DT', 'Châu Thành, Đồng Tháp') ON CONFLICT DO NOTHING;
INSERT INTO public.stock (stock_id, stock_name, stock_address) VALUES (5, 'Unleashed BL', 'Bảo Lộc, Lâm Đồng') ON CONFLICT DO NOTHING;


--
-- TOC entry 5295 (class 0 OID 25244)
-- Dependencies: 273
-- Data for Name: stock_variation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (1, 1, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (3, 1, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (4, 1, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (5, 1, 6) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (6, 1, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (7, 1, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (8, 1, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (9, 1, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (10, 1, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (13, 1, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (15, 1, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (12, 2, 1000) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (23, 2, 200) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (24, 2, 100) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (26, 2, 100) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (32, 2, 300) ON CONFLICT DO NOTHING;
INSERT INTO public.stock_variation (variation_id, stock_id, stock_quantity) VALUES (36, 2, 400) ON CONFLICT DO NOTHING;


--
-- TOC entry 5296 (class 0 OID 25247)
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
-- TOC entry 5298 (class 0 OID 25253)
-- Dependencies: 276
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (1, 1, 1, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 10, '2025-03-03', 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (2, 1, 3, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 10, '2025-03-03', 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (3, 1, 4, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 10, '2025-03-03', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (4, 1, 5, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 6, '2025-03-03', 66666666.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (5, 1, 6, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 10, '2025-03-03', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (6, 1, 7, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 10, '2025-03-03', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (7, 1, 8, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 10, '2025-03-03', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (8, 1, 9, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 10, '2025-03-03', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (9, 1, 10, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 10, '2025-03-03', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (10, 1, 13, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 10, '2025-03-03', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (11, 1, 15, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 10, '2025-03-03', 1500000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (14, 2, 12, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 1000, '2025-03-06', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (15, 2, 23, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 200, '2025-03-06', 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (16, 2, 24, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 100, '2025-03-06', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (17, 2, 26, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 100, '2025-03-06', 1500000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (18, 2, 32, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 300, '2025-03-06', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.transaction (transaction_id, stock_id, variation_id, provider_id, incharge_employee_id, transaction_type_id, transaction_quantity, transaction_date, transaction_product_price) VALUES (19, 2, 36, NULL, 'e43dff5d-7cac-45c7-a699-81b48beb33ef', 1, 400, '2025-03-06', 1500000.00) ON CONFLICT DO NOTHING;


--
-- TOC entry 5300 (class 0 OID 25259)
-- Dependencies: 278
-- Data for Name: transaction_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transaction_type (transaction_type_id, transaction_type_name) VALUES (1, 'IN') ON CONFLICT DO NOTHING;
INSERT INTO public.transaction_type (transaction_type_id, transaction_type_name) VALUES (2, 'OUT') ON CONFLICT DO NOTHING;


--
-- TOC entry 5302 (class 0 OID 25265)
-- Dependencies: 280
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."user" (user_id, role_id, is_user_enabled, user_google_id, user_username, user_password, user_fullname, user_email, user_phone, user_birthdate, user_address, user_image, user_current_payment_method, user_created_at, user_updated_at) VALUES ('e43dff5d-7cac-45c7-a699-81b48beb33ef',  1, true, NULL, 'admin123', '$2a$10$wEpm7dyhEnwQJyafwPhIXOWbB/O8JEW9Fi4910ZECm2lolkJj4dmy', 'HauLT', '.@1', '0896679121', NULL, '', 'https://i.ibb.co/M5crZDR8/z6197539031181-4fe25592444b34aee49431f0658e8846.jpg', NULL, '2025-02-17 15:28:13.38+07', '2025-02-27 16:01:28.338067+07') ON CONFLICT DO NOTHING;
INSERT INTO public."user" (user_id, role_id, is_user_enabled, user_google_id, user_username, user_password, user_fullname, user_email, user_phone, user_birthdate, user_address, user_image, user_current_payment_method, user_created_at, user_updated_at) VALUES ('5a53b431-ec19-4631-a43b-91e3e619170b',  3, true, NULL, 'staff123', '$2a$10$DfuCOI0wCBin3fleL8KCJe4qGlJbOC.eM7rz5basGg4fSGzFoXbHy', 'Staffu-chan', 'staff@staff.com', '0896679121', NULL, '', 'https://i.ibb.co/bMvPJ8dL/14.png', NULL, '2025-02-18 10:37:56.859+07', '2025-02-18 10:37:56.859+07') ON CONFLICT DO NOTHING;
INSERT INTO public."user" (user_id, role_id, is_user_enabled, user_google_id, user_username, user_password, user_fullname, user_email, user_phone, user_birthdate, user_address, user_image, user_current_payment_method, user_created_at, user_updated_at) VALUES ('506ac7fd-3b2a-4c72-b105-5338898fda5d',  2, true, NULL, 'HauTest', '$2a$10$HGkjDC.l3oryRQi0CiD.he6C7uWw0o0i39Qv2AfcrZduLKAh3eWFK', 'Hau', '.@2', '0123456789', NULL, NULL, NULL, NULL, '2025-03-03 11:34:28.24995+07', '2025-03-03 11:34:28.24995+07') ON CONFLICT DO NOTHING;
INSERT INTO public."user" (user_id, role_id, is_user_enabled, user_google_id, user_username, user_password, user_fullname, user_email, user_phone, user_birthdate, user_address, user_image, user_current_payment_method, user_created_at, user_updated_at) VALUES ('e808411f-cdd3-4991-bb13-a768fed10bca',  2, true, '110384002791577902840', 'letrunghau2244@gmail.com', '$2a$10$Vu9i4EBp5wZOHrTR206rX.yE8.g0c.04M/xl//VpU5dKKAcGwMp8O', 'Hau', 'letrunghau2244@gmail.com', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocLTn2Mw5SYzovFWfQ3AZmfY7W-UO-QT43WAnhXFM17xeMEYM4jw=s96-c', NULL, '2025-03-04 09:07:33.528343+07', '2025-03-04 09:07:33.528343+07') ON CONFLICT DO NOTHING;
INSERT INTO public."user" (user_id, role_id, is_user_enabled, user_google_id, user_username, user_password, user_fullname, user_email, user_phone, user_birthdate, user_address, user_image, user_current_payment_method, user_created_at, user_updated_at) VALUES ('e04d8236-4509-42cd-aa69-711e1f36c303',  2, true, '110661913958434601384', 'chitoanime@gmail.com', '$2a$10$D/J4O91avtcoqQv4i0BEh.pXazdxTaQF.MWj/KwyuP5TP9HSFHyW6', 'CMusic', 'chitoanime@gmail.com', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJTWCsc8dvYRb7yHJW7xyaZ7YPYfti4Xw4-agqUj-D0Hr8IvHL8=s96-c', NULL, '2025-03-07 13:57:52.3676+07', '2025-03-10 08:39:55.660886+07') ON CONFLICT DO NOTHING;
INSERT INTO public."user" (user_id, role_id, is_user_enabled, user_google_id, user_username, user_password, user_fullname, user_email, user_phone, user_birthdate, user_address, user_image, user_current_payment_method, user_created_at, user_updated_at) VALUES ('93948afd-aa6f-44cc-90f2-1b562bd3e621', 2, true, '116004321398421572707', 'gdownload327@gmail.com', '$2a$10$PossxvyzTPcsAUVI5aDVQ.xw6WMh5m2eO0kdoTjN1H3EKZuErc02C', 'Hau Le', 'gdownload327@gmail.com', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJHgXW_PZ0J1vtV3QLVEwFmVaV20CtU1km1ibqTKnM94LMBQg=s96-c', NULL, '2025-03-07 13:58:34.380476+07', '2025-03-10 08:40:01.056396+07') ON CONFLICT DO NOTHING;


--
-- TOC entry 5303 (class 0 OID 25270)
-- Dependencies: 281
-- Data for Name: user_discount; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5304 (class 0 OID 25275)
-- Dependencies: 282
-- Data for Name: user_rank; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5305 (class 0 OID 25280)
-- Dependencies: 283
-- Data for Name: variation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (1, 'd687c303-4793-49e8-8d4f-717b034c11ca', 5, 6, 'https://i.ibb.co/TxbjFdZG/image-2025-03-03-104008315.png', 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (3, '4d7bcbf9-a8dc-4410-b226-ac3d84d3badb', 6, 3, 'https://i.ibb.co/h1BW8Zxg/image-2025-03-03-105015244.png', 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (4, '2432e9cb-3823-4b40-b977-ae5adf7424f7', 6, 10, 'https://i.ibb.co/jZWPbTVf/image-2025-03-03-105118911.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (6, '539b9399-d9a2-49cb-8a79-3037cd885ac1', 6, 1, 'https://i.ibb.co/hw4s0Hk/image-2025-03-03-105358935.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (7, '1a24995c-7784-4bfa-aa7e-06d676ad09fd', 6, 10, 'https://i.ibb.co/MkwYmxVZ/image-2025-03-03-105513090.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (8, 'c59cc71b-09ef-41be-ae8c-0f45f4e898e6', 5, 1, 'https://i.ibb.co/4RmD8J9w/image-2025-03-03-105551240.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (9, 'fa869e27-0928-49f6-aa2c-ca5d816e579c', 6, 3, 'https://i.ibb.co/n8cFSQ9S/image-2025-03-03-105956898.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (10, '02ba9ff0-6955-4ee8-8ca7-6516528557f3', 6, 3, 'https://i.ibb.co/G4X28bZ9/image-2025-03-03-110047011.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (11, 'ea6bf5c2-2521-40de-b0f3-ae5ac79aad88', 5, 10, 'https://i.ibb.co/N2qsW94J/image-2025-03-03-110205854.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (12, '49cb8a36-f93a-4bf7-ac1a-21156e5a5d78', 5, 11, 'https://i.ibb.co/67hZZtrf/image-2025-03-03-110317118.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (13, '8521ff88-62d8-48cb-9315-27d3dbf103e3', 6, 3, 'https://i.ibb.co/YnDyG6D/image-2025-03-03-110500457.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (14, '7cf34ddf-8e22-4202-ac64-c8f2f0a363b3', 5, 1, 'https://i.ibb.co/Jh51vXW/image-2025-03-03-110642866.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (15, '8e426e33-971b-4544-8837-d2dbae591781', 6, 11, 'https://i.ibb.co/M5N1ZyMp/image-2025-03-03-110832126.png', 1500000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (16, '7cdb8189-83e2-46de-acf8-e2b8dfbe36b5', 5, 11, 'https://i.ibb.co/JwScszdJ/image-2025-03-03-110930028.png', 1500000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (17, 'f89b468d-7488-4881-8f5a-5ad24d46ec00', 5, 2, 'https://i.ibb.co/7N4LzzFz/image-2025-03-03-111041661.png', 1500000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (18, '6c94d08d-ba81-461f-9d1c-aab6d40f3bc7', 6, 5, 'https://i.ibb.co/wFt65PhC/image-2025-03-03-111127540.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (19, '249b0d45-19ab-4380-a639-dfb29d72c499', 4, 8, 'https://i.ibb.co/FqyV5s0N/image-2025-03-03-111245226.png', 1500000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (20, 'e9b10e5f-dfd8-47e4-ac38-e47799ecbc6c', 5, 8, 'https://i.ibb.co/0RdL2YfR/image-2025-03-03-111349153.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (21, '8cadf0aa-205c-4e60-a0cf-0ddcb4a456e4', 6, 11, 'https://i.ibb.co/v43MG6N3/image-2025-03-03-111517401.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (22, '0a30912c-2ca7-4bc4-8c55-328dfa5e8d93', 6, 9, 'https://i.ibb.co/C4cDN0X/image-2025-03-03-111616901.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (23, 'b5006db6-1120-48d1-aa1c-c7a28618f605', 5, 3, 'https://i.ibb.co/qFCXs2wJ/image-2025-03-03-111713613.png', 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (24, '5da2b1a7-18fb-4c9d-923b-100158163c14', 6, 3, 'https://i.ibb.co/Xr6mmrY4/image-2025-03-03-111813192.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (25, '68ec989f-b9b0-411f-84a2-d73894477ce2', 5, 5, 'https://i.ibb.co/ymKWSks3/image-2025-03-03-111927817.png', 1500000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (26, 'b0047023-66ef-467a-a7af-f739f94aecd9', 5, 15, 'https://i.ibb.co/JFSB3GQ7/image-2025-03-03-112000987.png', 1500000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (27, '5b4d8a68-7ce5-43cb-9b1c-a19395cc0e9d', 6, 9, 'https://i.ibb.co/Nnb7CnPf/image-2025-03-03-112102206.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (28, '76af1947-fa47-43c6-bd00-3fdf4c37e5c2', 5, 11, 'https://i.ibb.co/SDtyR9hp/image-2025-03-03-112134527.png', 1500000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (29, 'f361f9d5-a207-4322-802e-3c59d9dcbd7a', 6, 5, 'https://i.ibb.co/VYZ1Wy1V/image-2025-03-03-112148415.png', 1799997.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (30, '63b39dde-effe-4519-afae-666ba945e653', 6, 3, 'https://i.ibb.co/R4ZnkrB2/image-2025-03-03-112309489.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (31, 'f946787f-afa1-4e5e-baa3-52c2725f6fa8', 6, 11, 'https://i.ibb.co/0R7GgNtZ/image-2025-03-03-112346965.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (32, '28ca3933-a272-4f36-84d4-fc280c5cf984', 5, 7, 'https://i.ibb.co/MybyNJQV/image-2025-03-03-112444248.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (33, '946104c2-0641-465d-a2d2-1f2cfd724ac5', 6, 11, 'https://i.ibb.co/cXMhYG2d/image-2025-03-03-112517805.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (34, 'd9468861-c7c8-4fd8-865b-a24ebad95ba9', 5, 5, 'https://i.ibb.co/DfLrkzwY/image-2025-03-03-112611586.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (35, 'bb29fdd6-90fc-4910-a45b-ef838eda7b07', 6, 10, 'https://i.ibb.co/F4mr8Fqz/image-2025-03-03-112652396.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (36, '39c87bec-88d6-44a0-8bda-67efb1fc8065', 4, 7, 'https://i.ibb.co/60RzBDjP/image-2025-03-03-112750413.png', 1500000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (37, '86f7b1c9-c96b-45f7-923a-844946d4db2b', 6, 10, 'https://i.ibb.co/yDRQHvT/image-2025-03-03-112827077.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (38, '4dc195b3-49aa-42c3-b521-fa5f91087068', 6, 15, 'https://i.ibb.co/ccTBPt2M/image-2025-03-03-113005074.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (39, '09e7a2f5-f6f7-4704-b63c-5efe028f94ac', 6, 9, 'https://i.ibb.co/x8c3n6VZ/image-2025-03-03-113037858.png', 1800000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (40, 'd687c303-4793-49e8-8d4f-717b034c11ca', 6, 6, 'https://i.ibb.co/p6LDZCwc/image-2025-03-03-131417280.png', 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (5, '2a70582d-24e9-49a5-9759-1fef33b69030', 6, 6, 'https://i.ibb.co/FkYFh554/image-2025-03-03-105216701.png', 2100000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.variation (variation_id, product_id, size_id, color_id, variation_image, variation_price) VALUES (2, 'acd17d1f-9189-412e-a427-8de5af01f3e4', 5, 2, 'https://i.ibb.co/8g0wKQMs/image-2025-03-03-104230545.png', 1500000.00) ON CONFLICT DO NOTHING;


--
-- TOC entry 5306 (class 0 OID 25285)
-- Dependencies: 284
-- Data for Name: variation_single; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (1, 'SOL659-PURPLE-XXL-721490', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (2, 'SOL659-PURPLE-XXL-003364', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (3, 'SOL659-PURPLE-XXL-164018', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (4, 'ILS348-BLUE-XXXL-379656', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (5, 'ILS348-BLUE-XXXL-575104', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (6, 'THE335-RED-XXL-477357', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (7, 'THE335-RED-XXL-052750', true) ON CONFLICT DO NOTHING;
INSERT INTO public.variation_single (variation_single_id, variation_single_code, is_variation_single_bought) VALUES (8, 'THE335-RED-XXL-270053', true) ON CONFLICT DO NOTHING;


--
-- TOC entry 5309 (class 0 OID 25292)
-- Dependencies: 287
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5345 (class 0 OID 0)
-- Dependencies: 218
-- Name: brand_brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brand_brand_id_seq', 24, true);


--
-- TOC entry 5346 (class 0 OID 0)
-- Dependencies: 221
-- Name: category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_category_id_seq', 6, true);


--
-- TOC entry 5347 (class 0 OID 0)
-- Dependencies: 223
-- Name: chat_chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_chat_id_seq', 1, false);


--
-- TOC entry 5348 (class 0 OID 0)
-- Dependencies: 225
-- Name: color_color_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.color_color_id_seq', 23, true);


--
-- TOC entry 5349 (class 0 OID 0)
-- Dependencies: 227
-- Name: comment_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_comment_id_seq', 2, true);


--
-- TOC entry 5350 (class 0 OID 0)
-- Dependencies: 230
-- Name: discount_discount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discount_discount_id_seq', 1, false);


--
-- TOC entry 5351 (class 0 OID 0)
-- Dependencies: 232
-- Name: discount_status_discount_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discount_status_discount_status_id_seq', 3, true);


--
-- TOC entry 5352 (class 0 OID 0)
-- Dependencies: 234
-- Name: discount_type_discount_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discount_type_discount_type_id_seq', 2, true);


--
-- TOC entry 5353 (class 0 OID 0)
-- Dependencies: 236
-- Name: feedback_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedback_feedback_id_seq', 1, false);


--
-- TOC entry 5354 (class 0 OID 0)
-- Dependencies: 238
-- Name: message_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.message_message_id_seq', 1, false);


--
-- TOC entry 5355 (class 0 OID 0)
-- Dependencies: 240
-- Name: notification_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_notification_id_seq', 1, true);


--
-- TOC entry 5356 (class 0 OID 0)
-- Dependencies: 244
-- Name: order_status_order_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_status_order_status_id_seq', 6, true);


--
-- TOC entry 5357 (class 0 OID 0)
-- Dependencies: 247
-- Name: payment_method_payment_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_method_payment_method_id_seq', 4, true);


--
-- TOC entry 5358 (class 0 OID 0)
-- Dependencies: 251
-- Name: product_status_product_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_status_product_status_id_seq', 5, true);


--
-- TOC entry 5359 (class 0 OID 0)
-- Dependencies: 253
-- Name: provider_provider_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.provider_provider_id_seq', 1, true);


--
-- TOC entry 5360 (class 0 OID 0)
-- Dependencies: 255
-- Name: rank_rank_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rank_rank_id_seq', 5, true);


--
-- TOC entry 5361 (class 0 OID 0)
-- Dependencies: 257
-- Name: review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_review_id_seq', 2, true);


--
-- TOC entry 5362 (class 0 OID 0)
-- Dependencies: 259
-- Name: role_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_role_id_seq', 3, true);


--
-- TOC entry 5363 (class 0 OID 0)
-- Dependencies: 262
-- Name: sale_sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sale_sale_id_seq', 6, true);


--
-- TOC entry 5364 (class 0 OID 0)
-- Dependencies: 264
-- Name: sale_status_sale_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sale_status_sale_status_id_seq', 3, true);


--
-- TOC entry 5365 (class 0 OID 0)
-- Dependencies: 266
-- Name: sale_type_sale_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sale_type_sale_type_id_seq', 2, true);


--
-- TOC entry 5366 (class 0 OID 0)
-- Dependencies: 268
-- Name: shipping_method_shipping_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shipping_method_shipping_method_id_seq', 2, true);


--
-- TOC entry 5367 (class 0 OID 0)
-- Dependencies: 270
-- Name: size_size_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.size_size_id_seq', 6, true);


--
-- TOC entry 5368 (class 0 OID 0)
-- Dependencies: 272
-- Name: stock_stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_stock_id_seq', 1, false);


--
-- TOC entry 5369 (class 0 OID 0)
-- Dependencies: 275
-- Name: topic_topic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.topic_topic_id_seq', 6, true);


--
-- TOC entry 5370 (class 0 OID 0)
-- Dependencies: 277
-- Name: transaction_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_transaction_id_seq', 19, true);


--
-- TOC entry 5371 (class 0 OID 0)
-- Dependencies: 279
-- Name: transaction_type_transaction_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_type_transaction_type_id_seq', 2, true);


--
-- TOC entry 5372 (class 0 OID 0)
-- Dependencies: 285
-- Name: variation_single_variation_single_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.variation_single_variation_single_id_seq', 8, true);


--
-- TOC entry 5373 (class 0 OID 0)
-- Dependencies: 286
-- Name: variation_variation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.variation_variation_id_seq', 40, true);


--
-- TOC entry 4964 (class 2606 OID 25327)
-- Name: brand brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_pkey PRIMARY KEY (brand_id);


--
-- TOC entry 4966 (class 2606 OID 25329)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (user_id, variation_id);


--
-- TOC entry 4968 (class 2606 OID 25331)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (category_id);


--
-- TOC entry 4970 (class 2606 OID 25333)
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (chat_id);


--
-- TOC entry 4972 (class 2606 OID 25335)
-- Name: color color_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.color
    ADD CONSTRAINT color_pkey PRIMARY KEY (color_id);


--
-- TOC entry 4974 (class 2606 OID 25337)
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (comment_id);


--
-- TOC entry 4976 (class 2606 OID 33261)
-- Name: discount discount_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_code_unique UNIQUE (discount_code) INCLUDE (discount_code);


--
-- TOC entry 4978 (class 2606 OID 25339)
-- Name: discount discount_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_pkey PRIMARY KEY (discount_id);


--
-- TOC entry 4980 (class 2606 OID 25341)
-- Name: discount_status discount_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_status
    ADD CONSTRAINT discount_status_pkey PRIMARY KEY (discount_status_id);


--
-- TOC entry 4982 (class 2606 OID 25343)
-- Name: discount_type discount_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_type
    ADD CONSTRAINT discount_type_pkey PRIMARY KEY (discount_type_id);


--
-- TOC entry 4984 (class 2606 OID 25345)
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (feedback_id);


--
-- TOC entry 4986 (class 2606 OID 25347)
-- Name: message message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (message_id);


--
-- TOC entry 4988 (class 2606 OID 25349)
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (notification_id);


--
-- TOC entry 4990 (class 2606 OID 25351)
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4992 (class 2606 OID 25353)
-- Name: order_status order_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status
    ADD CONSTRAINT order_status_pkey PRIMARY KEY (order_status_id);


--
-- TOC entry 4994 (class 2606 OID 25355)
-- Name: order_variation_single order_variation_single_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_variation_single
    ADD CONSTRAINT order_variation_single_pkey PRIMARY KEY (order_id, variation_single_id);


--
-- TOC entry 4996 (class 2606 OID 25357)
-- Name: payment_method payment_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT payment_method_pkey PRIMARY KEY (payment_method_id);


--
-- TOC entry 4998 (class 2606 OID 25359)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);


--
-- TOC entry 5000 (class 2606 OID 25361)
-- Name: product_status product_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_status
    ADD CONSTRAINT product_status_pkey PRIMARY KEY (product_status_id);


--
-- TOC entry 5002 (class 2606 OID 25363)
-- Name: provider provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider
    ADD CONSTRAINT provider_pkey PRIMARY KEY (provider_id);


--
-- TOC entry 5004 (class 2606 OID 25365)
-- Name: rank rank_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rank
    ADD CONSTRAINT rank_pkey PRIMARY KEY (rank_id);


--
-- TOC entry 5006 (class 2606 OID 25367)
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);


--
-- TOC entry 5008 (class 2606 OID 25369)
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);


--
-- TOC entry 5010 (class 2606 OID 25371)
-- Name: sale sale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT sale_pkey PRIMARY KEY (sale_id);


--
-- TOC entry 5012 (class 2606 OID 25373)
-- Name: sale_product sale_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_product
    ADD CONSTRAINT sale_product_pkey PRIMARY KEY (sale_id, product_id);


--
-- TOC entry 5014 (class 2606 OID 25375)
-- Name: sale_status sale_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_status
    ADD CONSTRAINT sale_status_pkey PRIMARY KEY (sale_status_id);


--
-- TOC entry 5016 (class 2606 OID 25377)
-- Name: sale_type sale_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_type
    ADD CONSTRAINT sale_type_pkey PRIMARY KEY (sale_type_id);


--
-- TOC entry 5018 (class 2606 OID 25379)
-- Name: shipping_method shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_method
    ADD CONSTRAINT shipping_method_pkey PRIMARY KEY (shipping_method_id);


--
-- TOC entry 5020 (class 2606 OID 25381)
-- Name: size size_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.size
    ADD CONSTRAINT size_pkey PRIMARY KEY (size_id);


--
-- TOC entry 5022 (class 2606 OID 25383)
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (stock_id);


--
-- TOC entry 5024 (class 2606 OID 25385)
-- Name: stock_variation stock_variation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_variation
    ADD CONSTRAINT stock_variation_pkey PRIMARY KEY (stock_id, variation_id);


--
-- TOC entry 5026 (class 2606 OID 25387)
-- Name: topic topic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topic
    ADD CONSTRAINT topic_pkey PRIMARY KEY (topic_id);


--
-- TOC entry 5028 (class 2606 OID 25389)
-- Name: transaction transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (transaction_id);


--
-- TOC entry 5030 (class 2606 OID 25391)
-- Name: transaction_type transaction_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_type
    ADD CONSTRAINT transaction_type_pkey PRIMARY KEY (transaction_type_id);


--
-- TOC entry 5034 (class 2606 OID 25393)
-- Name: user_discount user_discount_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_discount
    ADD CONSTRAINT user_discount_pkey PRIMARY KEY (discount_id, user_id);


--
-- TOC entry 5032 (class 2606 OID 25395)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5036 (class 2606 OID 25397)
-- Name: user_rank user_rank_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rank
    ADD CONSTRAINT user_rank_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5038 (class 2606 OID 25399)
-- Name: variation variation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variation
    ADD CONSTRAINT variation_pkey PRIMARY KEY (variation_id);


--
-- TOC entry 5040 (class 2606 OID 25401)
-- Name: variation_single variation_single_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variation_single
    ADD CONSTRAINT variation_single_pkey PRIMARY KEY (variation_single_id);


--
-- TOC entry 5041 (class 2606 OID 25402)
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


--
-- TOC entry 5042 (class 2606 OID 25407)
-- Name: cart cart_variation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.variation(variation_id);


--
-- TOC entry 5043 (class 2606 OID 25412)
-- Name: chat chat_user_id_1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_user_id_1_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


--
-- TOC entry 5046 (class 2606 OID 25422)
-- Name: comment_parent comment_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_parent
    ADD CONSTRAINT comment_parent_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comment(comment_id);


--
-- TOC entry 5047 (class 2606 OID 25427)
-- Name: comment_parent comment_parent_comment_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_parent
    ADD CONSTRAINT comment_parent_comment_parent_id_fkey FOREIGN KEY (comment_parent_id) REFERENCES public.comment(comment_id);


--
-- TOC entry 5044 (class 2606 OID 25432)
-- Name: comment comment_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.review(review_id);


--
-- TOC entry 5048 (class 2606 OID 25437)
-- Name: discount discount_discount_rank_requirement_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_discount_rank_requirement_fkey FOREIGN KEY (discount_rank_requirement) REFERENCES public.rank(rank_id);


--
-- TOC entry 5049 (class 2606 OID 25442)
-- Name: discount discount_discount_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_discount_status_id_fkey FOREIGN KEY (discount_status_id) REFERENCES public.discount_status(discount_status_id);


--
-- TOC entry 5050 (class 2606 OID 25447)
-- Name: discount discount_discount_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_discount_type_id_fkey FOREIGN KEY (discount_type_id) REFERENCES public.discount_type(discount_type_id);


--
-- TOC entry 5051 (class 2606 OID 25452)
-- Name: feedback feedback_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(topic_id);


--
-- TOC entry 5045 (class 2606 OID 33255)
-- Name: comment fk_comment_parent_comment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT fk_comment_parent_comment FOREIGN KEY (parent_comment_id) REFERENCES public.comment(comment_id);


--
-- TOC entry 5052 (class 2606 OID 25457)
-- Name: message message_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chat(chat_id);


--
-- TOC entry 5053 (class 2606 OID 25462)
-- Name: message message_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public."user"(user_id);


--
-- TOC entry 5054 (class 2606 OID 25467)
-- Name: notification notification_user_id_sender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_user_id_sender_fkey FOREIGN KEY (user_id_sender) REFERENCES public."user"(user_id);


--
-- TOC entry 5055 (class 2606 OID 25472)
-- Name: notification_user notification_user_notification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_user
    ADD CONSTRAINT notification_user_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notification(notification_id);


--
-- TOC entry 5056 (class 2606 OID 25477)
-- Name: notification_user notification_user_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_user
    ADD CONSTRAINT notification_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


--
-- TOC entry 5057 (class 2606 OID 25482)
-- Name: order order_discount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discount(discount_id);


--
-- TOC entry 5058 (class 2606 OID 25487)
-- Name: order order_incharge_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_incharge_employee_id_fkey FOREIGN KEY (incharge_employee_id) REFERENCES public."user"(user_id) NOT VALID;


--
-- TOC entry 5059 (class 2606 OID 25492)
-- Name: order order_order_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_order_status_id_fkey FOREIGN KEY (order_status_id) REFERENCES public.order_status(order_status_id);


--
-- TOC entry 5060 (class 2606 OID 25497)
-- Name: order order_payment_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(payment_method_id);


--
-- TOC entry 5061 (class 2606 OID 25502)
-- Name: order order_shipping_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_shipping_method_id_fkey FOREIGN KEY (shipping_method_id) REFERENCES public.shipping_method(shipping_method_id);


--
-- TOC entry 5062 (class 2606 OID 25507)
-- Name: order order_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


--
-- TOC entry 5063 (class 2606 OID 25512)
-- Name: order_variation_single order_variation_single_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_variation_single
    ADD CONSTRAINT order_variation_single_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."order"(order_id);


--
-- TOC entry 5064 (class 2606 OID 25517)
-- Name: order_variation_single order_variation_single_variation_single_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_variation_single
    ADD CONSTRAINT order_variation_single_variation_single_id_fkey FOREIGN KEY (variation_single_id) REFERENCES public.variation_single(variation_single_id);


--
-- TOC entry 5065 (class 2606 OID 25522)
-- Name: product product_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand(brand_id);


--
-- TOC entry 5067 (class 2606 OID 25527)
-- Name: product_category product_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(category_id);


--
-- TOC entry 5068 (class 2606 OID 25532)
-- Name: product_category product_category_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- TOC entry 5066 (class 2606 OID 25537)
-- Name: product product_product_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_product_status_id_fkey FOREIGN KEY (product_status_id) REFERENCES public.product_status(product_status_id);


--
-- TOC entry 5069 (class 2606 OID 25542)
-- Name: review review_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- TOC entry 5070 (class 2606 OID 25547)
-- Name: review review_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


--
-- TOC entry 5071 (class 2606 OID 25552)
-- Name: review review_variation_single_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.order(order_id);


--
-- TOC entry 5074 (class 2606 OID 25557)
-- Name: sale_product sale_product_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_product
    ADD CONSTRAINT sale_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- TOC entry 5075 (class 2606 OID 25562)
-- Name: sale_product sale_product_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale_product
    ADD CONSTRAINT sale_product_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sale(sale_id);


--
-- TOC entry 5072 (class 2606 OID 25567)
-- Name: sale sale_sale_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT sale_sale_status_id_fkey FOREIGN KEY (sale_status_id) REFERENCES public.sale_status(sale_status_id);


--
-- TOC entry 5073 (class 2606 OID 25572)
-- Name: sale sale_sale_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT sale_sale_type_id_fkey FOREIGN KEY (sale_type_id) REFERENCES public.sale_type(sale_type_id);


--
-- TOC entry 5076 (class 2606 OID 25577)
-- Name: stock_variation stock_variation_stock_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_variation
    ADD CONSTRAINT stock_variation_stock_id_fkey FOREIGN KEY (stock_id) REFERENCES public.stock(stock_id);


--
-- TOC entry 5077 (class 2606 OID 25582)
-- Name: stock_variation stock_variation_variation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_variation
    ADD CONSTRAINT stock_variation_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.variation(variation_id);


--
-- TOC entry 5078 (class 2606 OID 25587)
-- Name: transaction transaction_incharge_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_incharge_employee_id_fkey FOREIGN KEY (incharge_employee_id) REFERENCES public."user"(user_id);


--
-- TOC entry 5079 (class 2606 OID 25592)
-- Name: transaction transaction_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.provider(provider_id);


--
-- TOC entry 5080 (class 2606 OID 25597)
-- Name: transaction transaction_stock_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_stock_id_fkey FOREIGN KEY (stock_id) REFERENCES public.stock(stock_id);


--
-- TOC entry 5081 (class 2606 OID 25602)
-- Name: transaction transaction_transaction_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_transaction_type_id_fkey FOREIGN KEY (transaction_type_id) REFERENCES public.transaction_type(transaction_type_id);


--
-- TOC entry 5082 (class 2606 OID 25607)
-- Name: transaction transaction_variation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES public.variation(variation_id);


--
-- TOC entry 5085 (class 2606 OID 25612)
-- Name: user_discount user_discount_discount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_discount
    ADD CONSTRAINT user_discount_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discount(discount_id);


--
-- TOC entry 5086 (class 2606 OID 25617)
-- Name: user_discount user_discount_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_discount
    ADD CONSTRAINT user_discount_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);



--
-- TOC entry 5087 (class 2606 OID 25658)
-- Name: user_rank user_rank_rank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rank
    ADD CONSTRAINT user_rank_rank_id_fkey FOREIGN KEY (rank_id) REFERENCES public.rank(rank_id) NOT VALID;


--
-- TOC entry 5088 (class 2606 OID 25663)
-- Name: user_rank user_rank_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rank
    ADD CONSTRAINT user_rank_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) NOT VALID;


--
-- TOC entry 5084 (class 2606 OID 25627)
-- Name: user user_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(role_id);


--
-- TOC entry 5089 (class 2606 OID 25632)
-- Name: variation variation_color_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variation
    ADD CONSTRAINT variation_color_id_fkey FOREIGN KEY (color_id) REFERENCES public.color(color_id);


--
-- TOC entry 5090 (class 2606 OID 25637)
-- Name: variation variation_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variation
    ADD CONSTRAINT variation_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- TOC entry 5091 (class 2606 OID 25642)
-- Name: variation variation_size_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variation
    ADD CONSTRAINT variation_size_id_fkey FOREIGN KEY (size_id) REFERENCES public.size(size_id);


--
-- TOC entry 5092 (class 2606 OID 25647)
-- Name: wishlist wishlist_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- TOC entry 5093 (class 2606 OID 25652)
-- Name: wishlist wishlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


-- Completed on 2025-03-13 08:32:52

--
-- PostgreSQL database dump complete
--


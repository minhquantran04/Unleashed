package com.unleashed.dto.mapper;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = OrderDetailMapper.class)
public interface OrderMapper {

//    @Mapping(source = "user.userId", target = "userId")
//    @Mapping(source = "user.username", target = "customerUsername") // Map customer username
//    @Mapping(source = "staff.userId", target = "staffId")
//    @Mapping(source = "staff.username", target = "staffUsername") // Map staff username
//    @Mapping(source = "orderDetails", target = "orderDetails")
//    OrderDTO toDTO(Order order);
//
//    @Mapping(source = "userId", target = "user.userId")
//    @Mapping(source = "customerUsername", target = "user.username") // Map customer username
//    @Mapping(source = "staffId", target = "staff.userId")
//    @Mapping(source = "staffUsername", target = "staff.username") // Map staff username
//    @Mapping(source = "orderDetails", target = "orderDetails")
//    Order toEntity(OrderDTO orderDTO);
}

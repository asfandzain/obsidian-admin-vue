declare namespace Api {
  /**
   * namespace Organization
   *
   * backend api module: "organization"
   */
  namespace Organization {
    interface OrganizationRecord {
      id: number;
      tenantId: string;
      tenantName: string;
      organizationCode: string;
      organizationName: string;
      description: string;
      status: Api.Common.EnableStatus;
      sort: number;
      teamCount: number;
      userCount: number;
      createTime: string;
      updateTime: string;
    }

    interface OrganizationListParams {
      current: number;
      size: number;
      keyword?: string;
      status?: Api.Common.EnableStatus;
    }

    interface OrganizationPayload {
      organizationCode: string;
      organizationName: string;
      description?: string;
      status?: Api.Common.EnableStatus;
      sort?: number;
    }

    interface OrganizationOption {
      id: number;
      organizationCode: string;
      organizationName: string;
    }

    type OrganizationList = Api.Common.PaginatingQueryRecord<OrganizationRecord>;
  }
}
